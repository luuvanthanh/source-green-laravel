<?php

namespace GGPHP\ActivityLog\Transformers;

use GGPHP\ActivityLog\Models\ActivityLog;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ChargeOldStudentTransformer;
use GGPHP\Refund\Transformers\RefundStudentTransformer;

/**
 * Class ActivityLogTransformer.
 *
 * @package namespace GGPHP\ActivityLog\Transformers;
 */
class ActivityLogTransformer extends BaseTransformer
{
    public function customAttributes($model): array
    {
        return [
            'Properties' => json_decode($model->Properties)
        ];
    }
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = [];
}
