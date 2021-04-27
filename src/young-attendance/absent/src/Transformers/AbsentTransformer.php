<?php

namespace GGPHP\YoungAttendance\Absent\Transformers;

use GGPHP\Clover\Transformers\ParentsTransformer;
use GGPHP\Clover\Transformers\StudentTransformer;
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
use GGPHP\YoungAttendance\Absent\Models\Absent;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class AbsentTransformer extends BaseTransformer
{

    protected $defaultIncludes = ['absentType'];
    protected $availableIncludes = ['parent', 'student', 'absentReason', 'shift', 'early', 'timekeeping'];

    /**
     * Include parent
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeParent(Absent $absent)
    {
        if (empty($absent->parent)) {
            return;
        }

        return $this->item($absent->parent, new ParentsTransformer, 'Parent');
    }

    /**
     * Include student
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeStudent(Absent $absent)
    {
        if (empty($absent->student)) {
            return;
        }

        return $this->item($absent->student, new StudentTransformer, 'Student');
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
        $parentHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($absent->ParentId, $absent->StartDate->format('Y-m-d'), $absent->StartDate->format('Y-m-d'));

        if (empty($parentHasWorkShift)) {
            return;
        }

        $shift = Shift::find($parentHasWorkShift[$absent->StartDate->format('Y-m-d')][0]['ShiftId']);

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

        $early = $absent->parent->lateEarly()->whereDate('Date', $startDate)->whereHas('lateEarlyConfig', function ($query) {
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

        $timekeeping = $absent->student->timekeeping()->whereDate('AttendedAt', $startDate)->get();

        return $this->collection($timekeeping, new TimekeepingTransformer, 'Timekeeping');
    }
}
