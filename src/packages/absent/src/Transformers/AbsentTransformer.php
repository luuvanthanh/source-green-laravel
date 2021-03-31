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
    protected $availableIncludes = ['user', 'absentReason', 'shift', 'early', 'timekeeping'];

    /**
     * Include AbsentType
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(Absent $absent)
    {
        if (empty($absent->user)) {
            return;
        }

        return $this->item($absent->user, new UserTransformer(), 'User');
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

        return $this->item($absent->absentReason, new AbsentReasonTransformer(), 'AbsentReason');
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

        return $this->item($absent->absentType, new AbsentTypeTransformer(), 'AbsentType');
    }

    /**
     * Include Owner
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeShift(Absent $absent)
    {
        $userHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($absent->user_id, $absent->start_date->format('Y-m-d'), $absent->start_date->format('Y-m-d'));

        if (empty($userHasWorkShift)) {
            return;
        }

        $shift = Shift::find($userHasWorkShift[$absent->start_date->format('Y-m-d')][0]['shift_id']);

        return $this->item($shift, new ShiftTransformer(), 'Shift');
    }

    /**
     * Include Owner
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeEarly(Absent $absent)
    {
        $startDate = $absent->start_date->format('Y-m-d');

        $early = $absent->user->lateEarly()->whereDate('date', $startDate)->whereHas('lateEarlyConfig', function ($query) {
            $query->where('type', LateEarlyTimeConfig::EARLY);
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
        $startDate = $absent->start_date->format('Y-m-d');

        $timekeeping = $absent->user->timekeeping()->whereDate('attended_at', $startDate)->get();

        return $this->collection($timekeeping, new TimekeepingTransformer, 'Timekeeping');
    }
}
