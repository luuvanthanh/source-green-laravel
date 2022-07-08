<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class NumberFormContractTransformer.
 *
 * @package namespace App\Transformers;
 */
class NumberFormContractTransformer extends BaseTransformer
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
            'Type' => array_search($model->Type, $model::TYPE)
        ];
    }
}
