<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Transformers\AbsentTransformer;
use GGPHP\Clover\Transformers\ClassTeacherTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use GGPHP\PositionLevel\Transformers\PositionLevelTransformer;
use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Models\User;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'timekeeping', 'absent', 'schedules', 'lateEarly', 'positionLevel', 'classTeacher', 'positionLevelNow',
    ];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;

        foreach (User::STATUS as $key => $value) {
            if ($value == $model->Status) {
                $status = $key;
            }
        }

        $attributes = [
            'timeKeepingReport' => $model->timeKeepingReport ? $model->timeKeepingReport : [],
            'totalWorks' => $model->totalWorks,
            'responseInvalid' => $model->responseInvalid,
            'Status' => $status,
            'workHourSummary' => $model->workHourSummary,
            'totalWorkHourSummary' => $model->totalWorkHourSummary,
            'busRegistrationSummary' => $model->busRegistrationSummary,
            'totalBusRegistration' => $model->totalBusRegistration,
        ];

        return $attributes;
    }

    /**
     * Include Store
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(User $employee)
    {
        return $this->collection(empty($employee->timekeeping) ? [] : $employee->timekeeping, new TimekeepingTransformer, 'Timekeeping');
    }

    /**
     * Include RankPositionInformation
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsent(User $employee)
    {
        return $this->collection($employee->absent, new AbsentTransformer, 'Absent');
    }

    /**
     * Include RankPositionInformation
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClassTeacher(User $employee)
    {
        if (empty($employee->classTeacher)) {
            return;
        }

        return $this->item($employee->classTeacher, new ClassTeacherTransformer, 'ClassTeacher');
    }

    /**
     * Include RankPositionInformation
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includePositionLevelNow(User $employee)
    {
        if (empty($employee->positionLevelNow)) {
            return;
        }

        return $this->item($employee->positionLevelNow, new PositionLevelTransformer, 'PositionLevelNow');
    }

    /**
     * Include schedules
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSchedules(User $employee)
    {
        return $this->collection(empty($employee->schedules) ? [] : $employee->schedules, new ScheduleTransformer, 'Schedules');
    }

    /** Include SubtractionTime
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLateEarly(User $employee)
    {
        return $this->collection(empty($employee->lateEarly) ? [] : $employee->lateEarly, new LateEarlyTransformer(), 'LateEarly');
    }

    /** Include SubtractionTime
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includePositionLevel(User $employee)
    {
        return $this->collection(empty($employee->positionLevel) ? [] : $employee->positionLevel, new PositionLevelTransformer, 'PositionLevel');
    }

}
