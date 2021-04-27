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
                $type = explode(',', $attributes['Type']);
                $queryTypeLateEarly->whereIn('Type', [$type]);
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
            $checkRankPosition = $employee->listRankPositionInformationHistory->filter(function ($item) use ($date) {
                $StartDate = $item->StartDate->format('Y-m-d');
                $EndDate = !is_null($item->EndDate) ? $item->EndDate->format('Y-m-d') : null;

                return ($StartDate <= $date && $EndDate >= $date) || ($StartDate <= $date && $EndDate == null);
            })->first();

            $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $date, $date);

            if (!empty($employeeTimeWorkShift)) {
                $timeDeadline = $this->checkTimeAllow($date, end($employeeTimeWorkShift[$date]));
                $timekeepings = $employee->timekeeping()->whereDate('AttendedAt', date($date))->get();

                $timeShift = [];
                $nowHours = !empty($attributes['time']) ? $attributes['time'] : Carbon::now()->format('H:i:ss');

                foreach ($employeeTimeWorkShift[$date] as $key => $value) {
                    $timeShift[] = $value['start_time'] . ' - ' . $value['end_time'];
                }

                $shift = Shift::findOrFail($employeeTimeWorkShift[$date][0]['ShiftId']);

                foreach ($employeeTimeWorkShift[$date] as $key => $value) {

                    $timeAllow = $this->checkTimeAllow($date, $value);

                    $timeDeadlineLaterly = Config::where('code', 'TIMEKEEPING_DEADLINE')->first()->value;

                    $formatStartTime = Carbon::parse($date . '' . $value['start_time'])->addMinutes($timeDeadlineLaterly)->format('Y-m-d H:i:s');
                    $formatEndTime = Carbon::parse($date . '' . $value['end_time'])->format('Y-m-d H:i:s');
                    $startTime = Carbon::parse($date . '' . $value['start_time'])->addMinutes($timeDeadlineLaterly)->format('H:i:s');

                    // di trễ
                    if ($nowHours > $startTime) {
                        $typeLate = LateEarly::LATE;

                        if ($key >= 1) {
                            $timeAllow['validBeforeStartTime'] = Carbon::parse($date . '' . $value['start_time'])->subMinutes(Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND')->first()->value)->toDateTimeString();
                        }

                        $timeKeepingAfterTimeStart = $employee->timekeeping()
                            ->where([['AttendedAt', '>=', $timeAllow['validBeforeStartTime']], ['AttendedAt', '<=', $formatStartTime]])
                            ->where('EmployeeId', $employee->Id)->get();

                        $timeKeepingBeforTimeStart = $employee->timekeeping()
                            ->where([['AttendedAt', '<=', $timeAllow['validAfterStartTime']], ['AttendedAt', '>', $formatStartTime]])
                            ->where('EmployeeId', $employee->Id)->orderBy('AttendedAt')->get();

                        if (empty(count($timeKeepingAfterTimeStart)) && !empty(count($timeKeepingBeforTimeStart))) {
                            //kiểm tra tồn tại đi trễ
                            $existLate = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($employee, $date) {
                                $query->where('type', LateEarlyTimeConfig::LATE);
                            })->where('EmployeeId', $employee->Id)
                                ->whereDate('Date', $date)
                                ->whereIn('time_slot', [$value['start_time'] . '-' . $value['end_time']])
                                ->get();

                            if (empty(count($existLate))) {
                                $timeAttendLate = Carbon::parse($timeKeepingBeforTimeStart[0]->AttendedAt)->format('H:i:s');

                                $timeLate = strtotime($timeAttendLate) - strtotime($startTime);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['from_time', '<=', gmdate("H:i:s", ($timeLate))],
                                        ['to_time', '>=', gmdate("H:i:s", ($timeLate))],
                                    ]
                                )->where('type', $typeLate)->first();

                                $statusLate = $timeLate > $this->setTimeLate() ? LateEarly::AUTOMATIC_APPROVE : LateEarly::PENDING;

                                $dataLate = [
                                    'time_config_type' => $configLateEarly->Id,
                                    'time' => gmdate("H:i:s", ($timeLate)),
                                    'date' => $date,
                                    'time_violation' => $timeAttendLate,
                                    'status' => $statusLate,
                                    'time_shift' => implode(',', $timeShift),
                                    'shift_code' => $shift->shift_code,
                                    'time_slot' => $value['start_time'] . '-' . $value['end_time'],
                                    'EmployeeId' => $employee->Id,
                                    'work_store' => $shift->store_id,
                                    'store_id' => $checkRankPosition->store_id,
                                ];

                                $this->model->create($dataLate);
                            }
                        }
                    }

                    // về sớm
                    if ($nowHours > $value['end_time']) {
                        $typeEarly = LateEarly::EARLY;
                        $timeKeepingAfterTimeEnd = $employee->timekeeping()
                            ->where([['AttendedAt', '>=', $timeAllow['validBeforeEndTime']], ['AttendedAt', '<', $formatEndTime]])
                            ->where('EmployeeId', $employee->Id)->orderBy('AttendedAt')->get();

                        if (!empty(count($timeKeepingAfterTimeEnd))) {

                            //kiểm tra tồn tại về sớm
                            $existEarly = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($employee, $date) {
                                $query->where('type', LateEarlyTimeConfig::EARLY);
                            })->where('EmployeeId', $employee->Id)
                                ->whereDate('Date', $date)
                                ->whereIn('time_slot', [$value['start_time'] . '-' . $value['end_time']])
                                ->get();

                            if (empty(count($existEarly))) {

                                $timeAttendEarly = Carbon::parse($timeKeepingAfterTimeEnd[0]->AttendedAt)->format('H:i:s');

                                $timeEarly = strtotime($value['end_time']) - strtotime($timeAttendEarly);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['from_time', '<=', gmdate("H:i:s", ($timeEarly))],
                                        ['to_time', '>=', gmdate("H:i:s", ($timeEarly))],
                                    ]
                                )->where('type', $typeEarly)->first();

                                $statusEarly = LateEarly::PENDING;

                                $dataLate = [
                                    'time_config_type' => $configLateEarly->Id,
                                    'time' => gmdate("H:i:s", ($timeEarly)),
                                    'date' => $date,
                                    'time_violation' => $timeAttendEarly,
                                    'status' => $statusEarly,
                                    'time_shift' => implode(',', $timeShift),
                                    'shift_code' => $shift->shift_code,
                                    'time_slot' => $value['start_time'] . '-' . $value['end_time'],
                                    'EmployeeId' => $employee->Id,
                                    'work_store' => $shift->store_id,
                                    'store_id' => $checkRankPosition->store_id,
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
                            ->where('status', LateEarly::INVALID)
                            ->whereDate('Date', $date)
                            ->get();

                        if (count($existInvalid) == 0) {
                            $data['date'] = $date;
                            $data['EmployeeId'] = $employee->Id;
                            $data['shift_code'] = $shift->shift_code;
                            $data['work_store'] = $shift->store_id;
                            $data['time_violation'] = Carbon::parse($timekeepingInvalid[0]->AttendedAt)->format('H:i:s');
                            $data['time_shift'] = implode(',', $timeShift);
                            $data['time_slot'] = $value['start_time'] . '-' . $value['end_time'];
                            $data['status'] = LateEarly::INVALID;
                            $data['store_id'] = $checkRankPosition->store_id;
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
        $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME')->first()->value;
        $minutesAfterStart = Config::where('code', 'DURATION_ALLOW_AFTERT_STARTTIME')->first()->value;
        $minutesBeforeEnd = Config::where('code', 'DURATION_ALLOW_BEFORE_ENDTIME')->first()->value;
        $minutesAfterEnd = Config::where('code', 'DURATION_ALLOW_AFTERT_ENDTIME')->first()->value;

        $durationAllow['validBeforeStartTime'] = !empty($item['start_time']) ? Carbon::parse($dateAttend . '' . $item['start_time'])->subMinutes($minutesBeforeStart)->toDateTimeString() : 0;
        $durationAllow['validAfterStartTime'] = !empty($item['start_time']) ? Carbon::parse($dateAttend . '' . $item['start_time'])->addMinutes($minutesAfterStart)->toDateTimeString() : 0;
        $durationAllow['validBeforeEndTime'] = !empty($item['end_time']) ? Carbon::parse($dateAttend . '' . $item['end_time'])->subMinutes($minutesBeforeEnd)->toDateTimeString() : 0;
        $durationAllow['validAfterEndTime'] = !empty($item['end_time']) ? Carbon::parse($dateAttend . '' . $item['end_time'])->addMinutes($minutesAfterEnd)->toDateTimeString() : 0;

        return $durationAllow;
    }

    /**
     * Set time late
     */
    public function setTimeLate()
    {
        return Config::where('code', 'TIME_LATE')->first()->value;
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

        $this->model = $this->model->where('status', LateEarly::INVALID);

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereIn('EmployeeId', explode(',', $attributes['employeeId']));
        }

        if (!empty($attributes['status_work_declaration'])) {
            $statusWorkDeclaration = explode(',', $attributes['status_work_declaration']);
            $this->model = $this->model->whereIn('status_work_declaration', $statusWorkDeclaration);
        }

        if (!empty($attributes['limit'])) {
            $employees = $this->paginate($attributes['limit']);
        } else {
            $employees = $this->get();
        }

        return $employees;
    }
}
