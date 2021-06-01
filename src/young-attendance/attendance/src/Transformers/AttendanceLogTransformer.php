<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class AttendanceLogTransformer.
 *
 * @package namespace GGPHP\Attendance\Transformers;
 */
class AttendanceLogTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
    protected $availableIncludes = ['employee', 'attendance'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {

    }

}
