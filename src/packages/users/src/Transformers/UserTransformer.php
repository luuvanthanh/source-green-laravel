<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Transformers\AbsentTransformer;
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
        'timekeeping', 'absent', 'schedules', 'lateEarly', 'positionLevel',
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
        $attributes = [
            'totalRealTimekeeping' => $model->totalRealTimekeeping,
            'totalHourRedundantTimekeeping' => $model->totalHourRedundantTimekeeping,
            'totalAdditionalTimes' => $model->additionalTimes,
            'totalAdditionalHours' => $model->additionalHours,
            'totalSubtractionTimes' => $model->subtractionTimes,
            'totalSubtractionHours' => $model->subtractionHours,
            'timeKeepingReport' => $model->timeKeepingReport ? $model->timeKeepingReport : [],
            'workHourRedundant' => $model->workHourRedundant,
            'totalAnnualAbsent' => $model->totalAnnualAbsent,
            'totalUnpaidAbsent' => $model->totalUnpaidAbsent,
            'totalTimekeepingWork' => round($model->totalWorks, 2),
            'totalHourRedundantWorks' => $model->totalHourRedundantWorks,
            'totalHourRedundantWorksFormatDate' => $model->totalHourRedundantWorksFormatDate,
            'totalTimekeepingDate' => $model->totalTimekeepingDate,
            'totalTimekeepingByMonth' => $model->totalTimekeepingByMonth,
            'totalHourRedundantByMonth' => $model->totalHourRedundantByMonth,
            'workBirthday' => $model->workBirthday,
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
        if (empty($employee->absent)) {
            return;
        }

        return $this->collection($employee->absent, new AbsentTransformer, 'Absent');
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
