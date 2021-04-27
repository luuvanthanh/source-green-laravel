<?php

namespace GGPHP\RevokeShift\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\RevokeShift\Models\RevokeShift;
use GGPHP\RevokeShift\Presenters\RevokeShiftPresenter;
use GGPHP\RevokeShift\Repositories\Contracts\RevokeShiftRepository;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use GGPHP\Users\Models\User;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class RevokeShiftRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class RevokeShiftRepositoryEloquent extends CoreRepositoryEloquent implements RevokeShiftRepository
{
    protected $fieldSearchable = [
        'Id',
    ];

    public function __construct(
        Application $app,
        TimekeepingRepositoryEloquent $timekeepingRepositoryEloquent
    ) {
        parent::__construct($app);
        $this->timekeepingRepositoryEloquent = $timekeepingRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return RevokeShift::class;
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
        return RevokeShiftPresenter::class;
    }

    public function getRevokeShift(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('DateViolation', '>=', $attributes['startDate'])->where('DateViolation', '<=', $attributes['endDate']);
        };

        if (!empty($attributes['statusWorkDeclaration'])) {
            $statusWorkDeclaration = explode(',', $attributes['statusWorkDeclaration']);
            $this->model = $this->model->whereIn('StatusWorkDeclaration', $statusWorkDeclaration);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $revokeShift = $this->paginate($attributes['limit']);
        } else {
            $revokeShift = $this->get();
        }

        return $revokeShift;
    }

    public function loadRevokeShift(array $attributes)
    {
        $employee = User::query();

        if (!empty($attributes['employeeId'])) {
            $employee->where('Id', $attributes['employeeId']);
        }

        $employee = $employee->get();

        $date = !empty($attributes['date']) ? $attributes['date'] : Carbon::now()->format('Y-m-d');

        foreach ($employee as $value) {
            $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($value->Id, $date, $date);

            if (!empty($employeeHasWorkShift)) {
                $timekepping = Timekeeping::where('EmployeeId', $value->Id)->whereDate('AttendedAt', $date)->get();

                if (empty(count($timekepping))) {

                    $absentType = AbsentType::whereIn('Type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE, AbsentType::QUIT_WORK])->pluck('Id')->toArray();
                    $absentType2 = AbsentType::whereIn('Type', [AbsentType::TYPE_OFF, AbsentType::AWOL])->pluck('Id')->toArray();

                    $absent = Absent::where('EmployeeId', $value->Id)->whereIn('AbsentTypeId', $absentType)->where(function ($q2) use ($date) {
                        $q2->where([['StartDate', '<=', $date], ['EndDate', '>=', $date]])
                            ->orWhere([['StartDate', '>=', $date], ['StartDate', '<=', $date]])
                            ->orWhere([['EndDate', '>=', $date], ['EndDate', '<=', $date]]);
                    })->get();
                    $absent2 = Absent::where('EmployeeId', 28)->whereIn('AbsentTypeId', $absentType2)->where(function ($q2) use ($date) {
                        $q2->where([['StartDate', '<=', $date], ['EndDate', '>=', $date]])
                            ->orWhere([['StartDate', '>=', $date], ['StartDate', '<=', $date]])
                            ->orWhere([['EndDate', '>=', $date], ['EndDate', '<=', $date]]);
                    })->get();
                    $data = [
                        "EmployeeId" => $value->Id,
                        "ShiftId" => $employeeHasWorkShift[$date][0]['ShiftId'],
                        "DateViolation" => $date,
                    ];

                    if (empty(count($absent)) && empty(count($absent2))) {
                        $checkRevokeShift = RevokeShift::where('EmployeeId', $data['EmployeeId'])->where('DateViolation', $data['DateViolation'])->first();

                        if (is_null($checkRevokeShift)) {
                            $revokeShift = RevokeShift::create($data);
                        }
                    }
                }

                $getTimekeeping = $this->timekeepingRepositoryEloquent->timekeepingReport($value->Id, null, null, $date, $date, null, true);

                if (isset($getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]) && $getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]['timekeepingReport'] == 0 && !empty(count($timekepping))) {
                    $shift = Shift::findOrFail($employeeHasWorkShift[$date][0]['ShiftId']);
                    $shiftCode = $shift->shift_code;
                    $timeShift = [];
                    foreach ($employeeHasWorkShift[$date] as $key => $time) {
                        $timeShift[] = $time['StartTime'] . ' - ' . $time['EndTime'];
                    }

                    $existInvalid = LateEarly::where('EmployeeId', $value->Id)
                        ->where('Status', LateEarly::INVALID)
                        ->whereDate('Date', $date)
                        ->get();

                    if (count($existInvalid) == 0) {
                        $data['Date'] = $date;
                        $data['CreationTime'] = $date;
                        $data['EmployeeId'] = $value->Id;
                        $data['ShiftCode'] = $shiftCode;
                        $data['TimeShift'] = implode(',', $timeShift);
                        $data['Status'] = LateEarly::INVALID;
                        LateEarly::create($data);
                    }
                }
            }

        }

        return $this->paginate(10);
    }
}
