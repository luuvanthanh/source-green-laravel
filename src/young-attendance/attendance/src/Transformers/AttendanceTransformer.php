<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class AttendanceTransformer.
 *
 * @package namespace GGPHP\Attendance\Transformers;
 */
class AttendanceTransformer extends BaseTransformer
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
        $status = null;

        foreach (Attendance::STATUS as $key => $value) {
            if ($value == $model->Status) {
                $status = $key;
            }
        }

        return [
            'Status' => $status,
        ];
    }

}
