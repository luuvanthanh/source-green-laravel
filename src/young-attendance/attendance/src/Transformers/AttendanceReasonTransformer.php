<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\AttendanceReason;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class AttendanceReasonTransformer.
 *
 * @package namespace GGPHP\Attendance\Transformers;
 */
class AttendanceReasonTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
    protected $availableIncludes = [];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
