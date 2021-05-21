<?php

namespace GGPHP\LateEarly\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Config\Models\Config;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\LateEarly\Presenters\LateEarlyPresenter;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyRepository;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LateEarlyRepositoryEloquent extends CoreRepositoryEloquent implements LateEarlyRepository
{
    protected $fieldSearchable = [
        'LateEarlyConfig.Type',
        'Status',
        'Employee.FullName' => 'like',
        'EmployeeId',
        'CreationTime',
    ];

    protected $employeeRepositoryEloquent, $timekeepingRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app,
        TimekeepingRepositoryEloquent $timekeepingRepositoryEloquent
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->timekeepingRepositoryEloquent = $timekeepingRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return LateEarly::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return LateEarlyPresenter::class;
    }

    /**
     * @param $attributes
     * @return mixed
     */
    public function filterLateEarly($attributes)
    {
        $this->model = $this->model->query();

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->where('EmployeeId', $employeeId);
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->whereHas('lateEarlyConfig', function ($queryTypeLateEarly) use ($attributes) {
                $type = explode(',', $attributes['type']);
                $queryTypeLateEarly->whereIn('Type', $type);
            });
        }

        if (!empty($attributes['limit'])) {
            $lateEarlies = $this->paginate($attributes['limit']);
        } else {
            $lateEarlies = $this->get();
        }

        return $lateEarlies;
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getLateEarlyByUser($attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->query();

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('lateEarly', function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['employeeId'])) {
                $query->whereIn('EmployeeId', explode(',', $attributes['employeeId']));
            }

        })->with(['lateEarly' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['employeeId'])) {
                $query->whereIn('EmployeeId', explode(',', $attributes['employeeId']));
            }

        }]);

        if (!empty($attributes['limit'])) {
            $employees = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $employees = $this->employeeRepositoryEloquent->get();
        }

        return $employees;
    }

    public function lateEarlyReportNew($attributes)
    {
        $employees = User::with(['timekeeping'])->get();
        $date = !empty($attributes['date']) ? $attributes['date'] : Carbon::now()->format('Y-m-d');

        foreach ($employees as $employee) {
            $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $date, $date);

            if (!empty($employeeTimeWorkShift)) {
                $timekeepings = $employee->timekeeping()->whereDate('AttendedAt', date($date))->get();

                $timeShift = [];
                $nowHours = !empty($attributes['time']) ? $attributes['time'] : Carbon::now()->format('H:i:ss');

                foreach ($employeeTimeWorkShift[$date] as $key => $value) {
                    $timeShift[] = $value['StartTime'] . ' - ' . $value['EndTime'];
                }

                $shift = Shift::findOrFail($employeeTimeWorkShift[$date][0]['ShiftId']);
                foreach ($employeeTimeWorkShift[$date] as $key => $value) {

                    $timeAllow = $this->checkTimeAllow($date, $value);

                    $formatStartTime = Carbon::parse($date . '' . $value['StartTime'])->format('Y-m-d H:i:s');
                    $formatEndTime = Carbon::parse($date . '' . $value['EndTime'])->format('Y-m-d H:i:s');
                    $startTime = Carbon::parse($date . '' . $value['StartTime'])->format('H:i:s');

                    // di trễ
                    if ($nowHours > $startTime) {
                        $typeLate = LateEarly::LATE;

                        $timeKeepingAfterTimeStart = $employee->timekeeping()
                            ->where([['AttendedAt', '<=', $formatStartTime]])
                            ->where('EmployeeId', $employee->Id)->get();

                        $timeKeepingBeforTimeStart = $employee->timekeeping()
                            ->where([['AttendedAt', '<=', $timeAllow['validAfterStartTime']], ['AttendedAt', '>', $formatStartTime]])
                            ->where('EmployeeId', $employee->Id)->orderBy('AttendedAt')->get();

                        if (empty(count($timeKeepingAfterTimeStart)) && !empty(count($timeKeepingBeforTimeStart))) {
                            //kiểm tra tồn tại đi trễ
                            $existLate = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($employee, $date) {
                                $query->where('Type', LateEarlyTimeConfig::LATE);
                            })->where('EmployeeId', $employee->Id)
                                ->whereDate('Date', $date)
                                ->whereIn('TimeSlot', [$value['StartTime'] . '-' . $value['EndTime']])
                                ->get();

                            if (empty(count($existLate))) {
                                $timeAttendLate = Carbon::parse($timeKeepingBeforTimeStart[0]->AttendedAt)->format('H:i:s');

                                $timeLate = strtotime($timeAttendLate) - strtotime($startTime);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['FromTime', '<=', gmdate("H:i:s", ($timeLate))],
                                        ['ToTime', '>=', gmdate("H:i:s", ($timeLate))],
                                    ]
                                )->where('Type', $typeLate)->first();

                                $statusLate = $timeLate > $this->setTimeLate() ? LateEarly::AUTOMATIC_APPROVE : LateEarly::PENDING;

                                $dataLate = [
                                    'TimeConfigType' => $configLateEarly->Id,
                                    'Time' => gmdate("H:i:s", ($timeLate)),
                                    'Date' => $date,
                                    'TimeViolation' => $timeAttendLate,
                                    'Status' => $statusLate,
                                    'TimeShift' => implode(',', $timeShift),
                                    'ShiftCode' => $shift->ShiftCode,
                                    'TimeSlot' => $value['StartTime'] . '-' . $value['EndTime'],
                                    'EmployeeId' => $employee->Id,
                                ];

                                $this->model->create($dataLate);
                            }
                        }
                    }

                    // về sớm
                    if ($nowHours > $value['EndTime']) {
                        $typeEarly = LateEarly::EARLY;
                        $timeKeepingAfterTimeEnd = $employee->timekeeping()
                            ->where([['AttendedAt', '>=', $timeAllow['validBeforeEndTime']], ['AttendedAt', '<', $formatEndTime]])
                            ->where('EmployeeId', $employee->Id)->orderBy('AttendedAt')->get();

                        if (!empty(count($timeKeepingAfterTimeEnd))) {

                            //kiểm tra tồn tại về sớm
                            $existEarly = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($employee, $date) {
                                $query->where('Type', LateEarlyTimeConfig::EARLY);
                            })
                                ->get();

                            if (empty(count($existEarly))) {

                                $timeAttendEarly = Carbon::parse($timeKeepingAfterTimeEnd[0]->AttendedAt)->format('H:i:s');

                                $timeEarly = strtotime($value['EndTime']) - strtotime($timeAttendEarly);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['FromTime', '<=', gmdate("H:i:s", ($timeEarly))],
                                        ['ToTime', '>=', gmdate("H:i:s", ($timeEarly))],
                                    ]
                                )->where('Type', $typeEarly)->first();

                                $statusEarly = LateEarly::PENDING;

                                $dataLate = [
                                    'TimeConfigType' => $configLateEarly->Id,
                                    'Time' => gmdate("H:i:s", ($timeEarly)),
                                    'Date' => $date,
                                    'TimeViolation' => $timeAttendEarly,
                                    'Status' => $statusEarly,
                                    'TimeShift' => implode(',', $timeShift),
                                    'ShiftCode' => $shift->ShiftCode,
                                    'TimeSlot' => $value['StartTime'] . '-' . $value['EndTime'],
                                    'EmployeeId' => $employee->Id,
                                ];

                                $this->model->create($dataLate);
                            }
                        }
                    }

                    // không xác định
                    // cham cong trong thoi gian khong xac dinh trong khung gio lam viec
                    $timekeepingInvalid = $employee->timekeeping()
                        ->where([['AttendedAt', '>', $timeAllow['validAfterStartTime']], ['AttendedAt', '<', $timeAllow['validBeforeEndTime']]])
                        ->where('EmployeeId', $employee->Id)
                        ->orderBy('AttendedAt')
                        ->get();

                    if (count($timekeepingInvalid) > 0) {
                        // TODO: kiem tra ton tai record Invalid
                        $existInvalid = LateEarly::where('EmployeeId', $employee->Id)
                            ->where('Status', LateEarly::INVALID)
                            ->whereDate('Date', $date)
                            ->get();

                        if (count($existInvalid) == 0) {
                            $data['Date'] = $date;
                            $data['EmployeeId'] = $employee->Id;
                            $data['ShiftCode'] = $shift->ShiftCode;
                            $data['TimeViolation'] = Carbon::parse($timekeepingInvalid[0]->AttendedAt)->format('H:i:s');
                            $data['TimeShift'] = implode(',', $timeShift);
                            $data['TimeSlot'] = $value['StartTime'] . '-' . $value['EndTime'];
                            $data['Status'] = LateEarly::INVALID;
                            $this->model->create($data);
                        }
                    }
                }
            }
        }

        return;
    }

    /**
     * @param $dateAttend
     * @param $item
     * @return mixed
     */
    public function checkTimeAllow($dateAttend, $item)
    {

        $durationAllow['validAfterStartTime'] = !empty($item['AfterStart']) ? Carbon::parse($dateAttend . '' . $item['AfterStart'])->toDateTimeString() : 0;
        $durationAllow['validBeforeEndTime'] = !empty($item['BeforeEnd']) ? Carbon::parse($dateAttend . '' . $item['BeforeEnd'])->toDateTimeString() : 0;

        return $durationAllow;
    }

    /**
     * Set time late
     */
    public function setTimeLate()
    {
        return Config::where('Code', 'TIME_LATE')->first()->value;
    }

    /**
     * get invalid Timekeeping
     * @param $attributes
     * @return \Illuminate\Config\Repository|mixed
     */
    public function invalidTimekeeping($attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
        }

        $this->model = $this->model->where('Status', LateEarly::INVALID);

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereIn('EmployeeId', explode(',', $attributes['employeeId']));
        }

        if (!empty($attributes['limit'])) {
            $employees = $this->paginate($attributes['limit']);
        } else {
            $employees = $this->get();
        }

        return $employees;
    }
}
