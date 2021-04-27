<?php

namespace GGPHP\Absent\Transformers;

use GGPHP\Absent\Models\Absent;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\ShiftSchedule\Transformers\ShiftTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Models\User;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class AbsentTransformer extends BaseTransformer
{

    protected $defaultIncludes = ['absentType'];
    protected $availableIncludes = ['employee', 'absentReason', 'shift', 'early', 'timekeeping'];

    /**
     * Include AbsentType
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(Absent $absent)
    {
        if (empty($absent->employee)) {
            return;
        }

        return $this->item($absent->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include AbsentReason
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeAbsentReason(Absent $absent)
    {
        if (empty($absent->absentReason)) {
            return;
        }

        return $this->item($absent->absentReason, new AbsentReasonTransformer, 'AbsentReason');
    }

    /**
     * Include AbsentType
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeAbsentType(Absent $absent)
    {
        if (empty($absent->absentType)) {
            return;
        }

        return $this->item($absent->absentType, new AbsentTypeTransformer, 'AbsentType');
    }

    /**
     * Include Owner
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeShift(Absent $absent)
    {
        $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($absent->EmployeeId, $absent->StartDate->format('Y-m-d'), $absent->StartDate->format('Y-m-d'));

        if (empty($employeeHasWorkShift)) {
            return;
        }

        $shift = Shift::find($employeeHasWorkShift[$absent->StartDate->format('Y-m-d')][0]['ShiftId']);

        return $this->item($shift, new ShiftTransformer, 'Shift');
    }

    /**
     * Include Owner
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeEarly(Absent $absent)
    {
        $startDate = $absent->StartDate->format('Y-m-d');

        $early = $absent->employee->lateEarly()->whereDate('Date', $startDate)->whereHas('lateEarlyConfig', function ($query) {
            $query->where('Type', LateEarlyTimeConfig::EARLY);
        })->get();

        return $this->collection($early, new LateEarlyTransformer, 'Early');
    }

    /**
     * Include Owner
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeTimekeeping(Absent $absent)
    {
        $startDate = $absent->StartDate->format('Y-m-d');

        $timekeeping = $absent->employee->timekeeping()->whereDate('AttendedAt', $startDate)->get();

        return $this->collection($timekeeping, new TimekeepingTransformer, 'Timekeeping');
    }
}
