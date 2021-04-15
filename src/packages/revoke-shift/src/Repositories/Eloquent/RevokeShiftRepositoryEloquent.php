<?php

namespace GGPHP\RevokeShift\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
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
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class RevokeShiftRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class RevokeShiftRepositoryEloquent extends BaseRepository implements RevokeShiftRepository
{
    protected $fieldSearchable = [
        'id',
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
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('date_violation', '>=', $attributes['start_date'])->where('date_violation', '<=', $attributes['end_date']);
        };

        if (!empty($attributes['status_work_declaration'])) {
            $statusWorkDeclaration = explode(',', $attributes['status_work_declaration']);
            $this->model = $this->model->whereIn('status_work_declaration', $statusWorkDeclaration);
        }

        if (!empty($attributes['EmployeeId'])) {
            $employeeId = explode(',', $attributes['EmployeeId']);
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

        if (!empty($attributes['EmployeeId'])) {
            $employee->where('id', $attributes['EmployeeId']);
        }

        $employee = $employee->get();

        $date = !empty($attributes['date']) ? $attributes['date'] : Carbon::now()->format('Y-m-d');

        foreach ($employee as $value) {
            $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($value->id, $date, $date);

            if (!empty($employeeHasWorkShift)) {
                $timekepping = Timekeeping::where('EmployeeId', $value->id)->whereDate('attended_at', $date)->get();

                if (empty(count($timekepping))) {

                    $absentType = AbsentType::whereIn('type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE, AbsentType::QUIT_WORK])->pluck('id')->toArray();
                    $absentType2 = AbsentType::whereIn('type', [AbsentType::TYPE_OFF, AbsentType::AWOL])->pluck('id')->toArray();

                    $absent = Absent::where('EmployeeId', $value->id)->whereIn('absent_type_id', $absentType)->where(function ($q2) use ($date) {
                        $q2->where([['start_date', '<=', $date], ['end_date', '>=', $date]])
                            ->orWhere([['start_date', '>=', $date], ['start_date', '<=', $date]])
                            ->orWhere([['end_date', '>=', $date], ['end_date', '<=', $date]]);
                    })->approved()->get();
                    $absent2 = Absent::where('EmployeeId', 28)->whereIn('absent_type_id', $absentType2)->where(function ($q2) use ($date) {
                        $q2->where([['start_date', '<=', $date], ['end_date', '>=', $date]])
                            ->orWhere([['start_date', '>=', $date], ['start_date', '<=', $date]])
                            ->orWhere([['end_date', '>=', $date], ['end_date', '<=', $date]]);
                    })->get();
                    $data = [
                        "EmployeeId" => $value->id,
                        "shift_id" => $employeeHasWorkShift[$date][0]['shift_id'],
                        "date_violation" => $date,
                    ];

                    if (empty(count($absent)) && empty(count($absent2))) {
                        $checkRevokeShift = RevokeShift::where('EmployeeId', $data['EmployeeId'])->where('date_violation', $data['date_violation'])->first();

                        if (is_null($checkRevokeShift)) {
                            $revokeShift = RevokeShift::create($data);
                        }
                    }
                }

                $getTimekeeping = $this->timekeepingRepositoryEloquent->timekeepingReport($value->id, null, null, $date, $date, null, true);

                if (isset($getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]) && $getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]['timekeepingReport'] == 0 && !empty(count($timekepping))) {
                    $checkRankPosition = $value->listRankPositionInformationHistory->filter(function ($item) use ($date) {
                        $start_date = $item->start_date->format('Y-m-d');
                        $end_date = !is_null($item->end_date) ? $item->end_date->format('Y-m-d') : null;

                        return ($start_date <= $date && $end_date >= $date) || ($start_date <= $date && $end_date == null);
                    })->first();

                    $shift = Shift::findOrFail($employeeHasWorkShift[$date][0]['shift_id']);
                    $shiftCode = $shift->shift_code;
                    $timeShift = [];
                    foreach ($employeeHasWorkShift[$date] as $key => $time) {
                        $timeShift[] = $time['start_time'] . ' - ' . $time['end_time'];
                    }

                    $existInvalid = LateEarly::where('EmployeeId', $value->id)
                        ->where('status', LateEarly::INVALID)
                        ->whereDate('date', $date)
                        ->get();

                    if (count($existInvalid) == 0) {
                        $data['date'] = $date;
                        $data['created_at'] = $date;
                        $data['EmployeeId'] = $value->id;
                        $data['shift_code'] = $shiftCode;
                        $data['time_shift'] = implode(',', $timeShift);
                        $data['status'] = LateEarly::INVALID;
                        $data['store_id'] = $checkRankPosition->store_id;
                        LateEarly::create($data);
                    }
                }
            }

        }

        return $this->paginate(10);
    }
}
