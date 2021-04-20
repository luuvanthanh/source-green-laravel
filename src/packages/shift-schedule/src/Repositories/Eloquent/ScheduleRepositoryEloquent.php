<?php

namespace GGPHP\ShiftSchedule\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ShiftSchedule\Models\Schedule;
use GGPHP\ShiftSchedule\Presenters\SchedulePresenter;
use GGPHP\ShiftSchedule\Repositories\Contracts\ScheduleRepository;
use GGPHP\ShiftSchedule\Services\ScheduleExceptionService;
use GGPHP\ShiftSchedule\Services\ScheduleRepeatService;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ScheduleRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ScheduleRepositoryEloquent extends CoreRepositoryEloquent implements ScheduleRepository
{

    protected $employeeRepositoryEloquent;

    public function __construct(UserRepositoryEloquent $employeeRepositoryEloquent, Application $app)
    {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'Employee.FullName' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Schedule::class;
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
        return SchedulePresenter::class;
    }

    /**
     * Get the end date from the input value
     * @param  array  $attributes
     * @return date  $dayend
     */
    public static function getDayEnd(array $attributes)
    {
        $date = new Carbon($attributes['startDate']);
        $dateEnd = $date->toDateString();

        if (isset($attributes['repeatBy'])) {
            switch ($attributes['repeatBy']) {
                case 'daily':
                    $date->addDays($attributes['count']);
                    $dateEnd = $date->toDateString();
                    break;
                case 'monthly':
                    $day = [];
                    for ($i = 0; $i < $attributes['count'] + 1; $i++) {
                        $firstDate = new Carbon($date);
                        $oldDate = $firstDate->format('d');
                        $firstDate->addMonths($i);
                        $newDate = $firstDate->format('d');

                        if ($newDate !== $oldDate) {
                            continue;
                        }
                        $day[] = $firstDate->toDateString();
                    }
                    $dateEnd = end($day);
                    break;
                case 'weekly':
                    if (is_array($attributes['byWeekDay'])) {
                        $byWeekDay = $attributes['byWeekDay'];
                    } else {
                        $byWeekDay = explode(',', $attributes['byWeekDay']);
                    }
                    $date->addWeeks($attributes['count'] / count($byWeekDay));
                    $dateEnd = $date->toDateString();
                    break;
                default:
                    $dateEnd = $date;
                    break;
            }
        }

        return $dateEnd;
    }

    /**
     * Override method create to add owners
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function createOrUpdate(array $attributes)
    {
        $startDate = new Carbon($attributes['startDate']);
        $dateEndYear = $startDate->endOfYear();

        if (isset($attributes['repeatBy'])) {
            $attributes['count'] = $this::getCountRepeat($attributes['repeatBy'], $attributes['startDate'], $dateEndYear);
        }
        $attributes['endDate'] = $this::getDayEnd($attributes);
        $schedule = $this->model()::create($attributes);

        if (isset($attributes['repeatBy'])) {
            $attributes['ScheduleId'] = $schedule->Id;
            ScheduleRepeatService::add(\Arr::except($attributes, ['StartDate', 'EmployeeId', 'ShiftId']));
        }

        $listDaySchedule = $this::getDayRepeat($schedule);
        //Kiểm tra và tạo ngoại lệ cho các lịch có sẵn
        $oldschedule = $this->model()::whereNotIn('Id', [$schedule->Id])->where('EmployeeId', $attributes['employeeId'])->where(function ($query) use ($attributes, $dateEndYear) {
            $query->where([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $dateEndYear]]);
        })->get();

        if (isset($attributes['repeatBy']) && $attributes['repeatBy'] === 'daily') {
            foreach ($oldschedule as $value) {
                if ($value->StartDate->format('Y-m-d') >= Carbon::parse($attributes['startDate'])->format('Y-m-d')) {
                    $value->delete();
                } else {
                    $this->updateScheduleByStartDate($value, $attributes['startDate']);
                }
            }
        } else {

            foreach ($oldschedule as $value) {
                if (empty($value->scheduleRepeat)) {
                    $dayValue = $this::getDayRepeat($value);
                    if (in_array($dayValue, $listDaySchedule)) {
                        $value->delete();
                    }
                }

                $dateException = [];
                $listDayValue = $this::getDayRepeat($value);
                for ($i = 0; $i < count($listDayValue); $i++) {
                    if (in_array($listDayValue[$i], $listDaySchedule)) {
                        $dateException[] = $listDayValue[$i];
                    }
                }

                if (!empty($dateException)) {
                    ScheduleExceptionService::add($value, $dateException);
                }

            }
        }

        return parent::find($schedule->Id);
    }

    /**
     * Get list schedule employee
     *
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function scheduleUser(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['schedules' => function ($query) use ($attributes) {
                $query->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]]);
            }]);

            // get Absent for calendar schedule: (nguyennd)
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
                $query->whereNotIn('AbsentTypeId', [6, 7])->where(function ($q2) use ($attributes) {
                    $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                        ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                        ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
                });
            }]);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereIn('Id', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $scheduleUser = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $scheduleUser = $this->employeeRepositoryEloquent->get();
        }

        return $scheduleUser;
    }

    /**
     * Get day repeat for schedule
     *
     * @param  Schedule  $schedule
     * @return array
     */
    public static function getDayRepeat($schedule)
    {
        $repeatBy = null;
        $day = [];
        if (!is_null($schedule->scheduleRepeat)) {
            $repeatBy = $schedule->scheduleRepeat->RepeatBy;
        }

        $date = new Carbon($schedule->StartDate);
        switch ($repeatBy) {
            case 'daily':
                for ($i = 0; $i < $schedule->scheduleRepeat->Count + 1; $i++) {
                    $day[] = $date->toDateString();
                    $date->addDay();
                }
                break;
            case 'weekly':
                switch ($date->format('l')) {
                    case 'Monday':
                        $dateNumber = 2;
                        break;
                    case 'Tuesday':
                        $dateNumber = 3;
                        break;
                    case 'Wednesday':
                        $dateNumber = 4;
                        break;
                    case 'Thursday':
                        $dateNumber = 5;
                        break;
                    case 'Friday':
                        $dateNumber = 6;
                        break;
                    case 'Saturday':
                        $dateNumber = 7;
                        break;
                    case 'Sunday':
                        $dateNumber = 8;
                        break;
                    default:
                        break;
                }
                for ($i = 0; $i < count($schedule->scheduleRepeat->ByWeekDay); $i++) {
                    switch ($schedule->scheduleRepeat->ByWeekDay[$i]) {
                        case 'mo':
                            $byWeekDay[] = 2;
                            break;
                        case 'tu':
                            $byWeekDay[] = 3;
                            break;
                        case 'we':
                            $byWeekDay[] = 4;
                            break;
                        case 'th':
                            $byWeekDay[] = 5;
                            break;
                        case 'fr':
                            $byWeekDay[] = 6;
                            break;
                        case 'sa':
                            $byWeekDay[] = 7;
                            break;
                        case 'su':
                            $byWeekDay[] = 8;
                            break;
                        default:
                            break;
                    }
                }
                for ($i = 0; $i < count($byWeekDay); $i++) {
                    $date = new Carbon($schedule->StartDate);
                    $checkDuplicate = $byWeekDay[$i] - $dateNumber;
                    $date = $date->addDays($checkDuplicate);

                    if ($checkDuplicate < 0) {
                        $date = $date->addDays(7);
                    }
                    for ($j = 0; $j < $schedule->scheduleRepeat->Count + 1; $j++) {
                        $day[] = $date->toDateString();
                        $date->addWeek();
                    }
                }
                break;
            case 'monthly':
                for ($i = 0; $i < $schedule->scheduleRepeat->Count + 1; $i++) {
                    $firstDate = new Carbon($schedule->StartDate);
                    $oldDate = $firstDate->format('d');
                    $firstDate->addMonths($i);
                    $newDate = $firstDate->format('d');

                    if ($newDate !== $oldDate) {
                        continue;
                    }

                    $day[] = $firstDate->toDateString();
                }
                break;
            default:
                $day[] = $date->toDateString();
                break;
        }
        return $day;
    }

    /**
     * Delete schedule repeat
     * @param  array  $attributes attributes from request
     * @param  Integer  $id
     * @return object
     */
    public function deleteScheduleRepeat($id, array $attributes)
    {
        $schedule = Schedule::findOrFail($id);
        if (empty($schedule->scheduleRepeat)) {
            $schedule->delete();
        } else {
            $date = Carbon::parse($attributes['date'])->format('Y-m-d');
            ScheduleExceptionService::add($schedule, [$date]);
        }
        $this->resetModel();

        return $schedule;
    }

    /**
     * Override method delete
     *
     * @param  Integer  $id
     * @return object
     */
    public function deleteAll($id, array $attributes)
    {
        $schedule = Schedule::findOrFail($id);
        $startDate = $attributes['startDate'];

        if (Carbon::parse($startDate)->format('Y-m-d') > $schedule->StartDate->format("Y-m-d")) {
            $this->updateScheduleByStartDate($schedule, $startDate);
        } else {
            $schedule->delete();
        }

        $dateEndYear = new Carbon($attributes['startDate']);
        $dateEndYear = $dateEndYear->endOfYear();
        $oldschedule = $this->model()::whereNotIn('Id', [$id])->where(function ($query) use ($attributes, $dateEndYear) {
            $query->where([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $dateEndYear]]);
        })->where('ShiftId', $schedule->ShiftId)->where('EmployeeId', $schedule->EmployeeId)->get();

        foreach ($oldschedule as $value) {
            if ($value->StartDate->format("Y-m-d") >= Carbon::parse($startDate)->format('Y-m-d')) {
                $value->delete();
            } else {
                $this->updateScheduleByStartDate($value, $startDate);
            }
        }

        $this->resetModel();
        return $this->parserResult($schedule);
    }

    /**
     * Override method delete
     *
     * @param  Schedule  $schedule
     * @param  Date  $startDate
     * @return object
     */
    public function updateScheduleByStartDate($schedule, $startDate)
    {
        $repeatBy = null;
        $startDate = new Carbon($startDate);
        if (!is_null($schedule->scheduleRepeat)) {
            $repeatBy = $schedule->scheduleRepeat->RepeatBy;
        }
        switch ($repeatBy) {
            case 'daily':
                $count = $startDate->diffInDays($schedule->StartDate);
                $endDate = $schedule->StartDate->addDays($count - 1);
                $schedule->update(['EndDate' => $endDate]);
                $schedule->scheduleRepeat->update(['count' => $count - 1]);
                break;
            case 'weekly':
                $count = $startDate->diffInDays($schedule->StartDate);
                $count = ceil(($count / 7) - 1);
                $endDate = $schedule->StartDate->addWeeks($count / count($schedule->scheduleRepeat->ByWeekDay));
                $schedule->update(['EndDate' => $endDate]);
                $schedule->scheduleRepeat->update(['count' => $count]);
                break;
            case 'monthly':
                $outMonth = $schedule->StartDate->format('m');
                $newMonth = $startDate->format('m');
                $endDate = null;
                if ($schedule->StartDate->format('d') < $startDate->format('d')) {
                    $count = $newMonth - $outMonth;
                } else {
                    $count = $newMonth - $outMonth - 1;
                    if ($count < 0) {
                        $count = 0;
                    }
                }

                $day = [];
                for ($i = 0; $i < $count + 1; $i++) {
                    $firstDate = new Carbon($schedule->StartDate);
                    $oldDate = $firstDate->format('d');
                    $firstDate->addMonths($i);
                    $newDate = $firstDate->format('d');

                    if ($newDate !== $oldDate) {
                        continue;
                    }
                    $day[] = $firstDate->toDateString();
                }

                $endDate = end($day);
                $schedule->update(['EndDate' => $endDate]);
                $schedule->scheduleRepeat->update(['count' => $count]);
                break;
            default:
                break;
        }

    }

    /**
     * Get count repeat schedule
     *
     * @param  Schedule  $schedule
     * @param  Date  $startDate
     * @return object
     */
    public static function getCountRepeat($repeatBy, $startDate, $dateEndYear)
    {
        $count = null;
        switch ($repeatBy) {
            case 'daily':
                $count = $dateEndYear->diffInDays($startDate);
                break;
            case 'weekly':
                $count = floor($dateEndYear->diffInDays($startDate) / 7);
                break;
            case 'monthly':
                $startDate = new Carbon($startDate);
                $monthStart = $startDate->format('m');
                $count = 12 - $monthStart;
                break;
            default:
                break;
        }

        return $count;
    }

    /**
     * Get employee time workshift
     *
     * @param  Schedule  $schedule
     * @param  Date  $startDate
     * @return object
     */
    public static function getUserTimeWorkShift($employeeId, $startDate, $endDate)
    {
        $listDayRequest = [];
        $workDate = [];
        $employeeTimeWorkShift = [];
        $diffDay = Carbon::parse($endDate)->diffInDays(Carbon::parse($startDate));

        for ($i = 0; $i <= $diffDay; $i++) {
            $listDayRequest[] = Carbon::parse($startDate)->addDays($i)->toDateString();
        }
        $employee = User::where('Id', $employeeId)->with(['schedules' => function ($query) use ($startDate, $endDate) {
            $query->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orwhere([['StartDate', '>', $startDate], ['StartDate', '<=', $endDate]])
                ->orwhere([['EndDate', '>=', $startDate], ['EndDate', '<', $endDate]]);
        }])->first();

        foreach ($employee->schedules as $value) {
            $listDaySchedule = self::getDayRepeat($value);
            $listDayException = ScheduleExceptionService::getDayException($value->Id);
            $workDate = array_diff($listDaySchedule, $listDayException);

            if (empty($value->shift->shiftDetail)) {
                continue;
            }
            $shiftDetail = $value->shift->shiftDetail->toArray();

            foreach ($shiftDetail as $key => $detail) {
                $shiftDetail[$key]['ShiftCode'] = $value->shift->ShiftCode;
            }

            foreach ($workDate as $day) {
                $employeeTimeWorkShift[$day] = $shiftDetail;
            }
        }

        foreach ($employeeTimeWorkShift as $key => $value) {
            if (!in_array($key, $listDayRequest)) {
                unset($employeeTimeWorkShift[$key]);
            }
        }

        return $employeeTimeWorkShift;
    }
}
