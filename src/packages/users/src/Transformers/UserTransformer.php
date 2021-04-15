<?php

namespace GGPHP\Users\Transformers;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Transformers\AbsentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use GGPHP\Profiles\Transformers\SabbaticalLeaveTransformer;
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
        'timekeeping', 'absent', 'schedules', 'lateEarly',
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

        if (!is_null(\Request::route())) {
            // Absent calculator
            if (request()->type === 'month') {
                $countAnnualAbsentsByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::ANNUAL_LEAVE);
                $countUnpaidLeaveByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::UNPAID_LEAVE);
                $countAwolLeaveByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::AWOL);
                $attributes['annualAbsentsByMonth'] = $countAnnualAbsentsByMonth;
                $attributes['unpaidLeaveByMonth'] = $countUnpaidLeaveByMonth;
                $attributes['countAwolLeaveByMonth'] = $countAwolLeaveByMonth;
            } elseif (request()->type === 'year' || isset(request()->id) || \Request::route()->getName() == 'employees.me.show') {

                $currentYear = Carbon::now()->format('Y-m-d');

                $attributes['absentYear'] = $model->countAbsents(request()->start_date ? request()->start_date : $currentYear, request()->end_date);
            }

            if (\Request::route()->getName() == 'reviews.employee-review-productivity.show-mobile') {
                $attributes['reviewProductivityYear'] = $model->reviewProductivityYear;
            }

            if (\Request::route()->getName() == 'faults.summary') {
                $attributes['faults_count'] = $model->faults_count;
            }

        }

        return $attributes;
    }

    /**
     * Include Store
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(User $employee)
    {
        return $this->collection(empty($employee->timekeeping) ? [] : $employee->timekeeping, new TimekeepingTransformer(), 'Timekeeping');
    }

    /**
     * Include RankPositionInformation
     * @param User $employee
     * @return \League\Fractal\Resource\Item
     */
    public function includeSabbaticalLeave(User $employee)
    {
        if (empty($employee->sabbaticalLeaves)) {
            return;
        }

        return $this->item($employee->sabbaticalLeaves, new SabbaticalLeaveTransformer(), 'SabbaticalLeave');
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

        return $this->collection($employee->absent, new AbsentTransformer(), 'Absent');
    }

    /**
     * Include schedules
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSchedules(User $employee)
    {
        return $this->collection(empty($employee->schedules) ? [] : $employee->schedules, new ScheduleTransformer(), 'Schedules');
    }

    /** Include SubtractionTime
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLateEarly(User $employee)
    {
        return $this->collection(empty($employee->lateEarly) ? [] : $employee->lateEarly, new LateEarlyTransformer(), 'LateEarly');
    }

}
