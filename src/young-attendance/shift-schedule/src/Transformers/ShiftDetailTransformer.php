<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Models\ShiftDetail;

/**
 * Class ShiftDetailTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\ShiftSchedule\Transformers;
 */
class ShiftDetailTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

}
