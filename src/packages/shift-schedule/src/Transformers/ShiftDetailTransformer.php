<?php

namespace GGPHP\ShiftSchedule\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Models\ShiftDetail;

/**
 * Class ShiftDetailTransformer.
 *
 * @package namespace GGPHP\ShiftSchedule\Transformers;
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
