<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\ScheduleRepeat;

/**
 * Class ScheduleRepeatTransformer.
 *
 * @package namespace GGPHP\ShiftSchedule\Transformers;
 */
class ScheduleRepeatTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

}
