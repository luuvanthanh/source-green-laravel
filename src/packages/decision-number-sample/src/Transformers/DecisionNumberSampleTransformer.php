<?php

namespace GGPHP\DecisionNumberSample\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class DecisionNumberSampleTransformer.
 *
 * @package namespace GGPHP\DecisionNumberSample\Transformers;
 */
class DecisionNumberSampleTransformer extends BaseTransformer
{
    public function customAttributes($model): array
    {
        return [
            'Type' => array_search($model->Type, $model::TYPE)
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
