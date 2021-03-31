<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\ScheduleException;

/**
 * Class ScheduleExceptionTransformer.
 *
 * @package namespace GGPHP\ShiftSchedule\Transformers;
 */
class ScheduleExceptionTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

}
