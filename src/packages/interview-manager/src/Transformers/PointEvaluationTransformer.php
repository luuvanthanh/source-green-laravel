<?php

namespace GGPHP\InterviewManager\Transformers;

use GGPHP\InterviewManager\Models\Refund;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class RefundTransformer.
 *
 * @package namespace GGPHP\InterviewManager\Transformers;
 */
class PointEvaluationTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'PointFrom' => (float) $model->PointFrom,
            'PointTo' => (float) $model->PointTo
        ];
    }
}
