<?php

namespace GGPHP\ExpectedTime\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ExpectedTime\Models\ExpectedTime;

/**
 * Class ExpectedTimeTransformer.
 *
 * @package namespace App\Transformers;
 */
class ExpectedTimeTransformer extends BaseTransformer
{
    protected $availableIncludes = ['expectedTimeDetail'];

    protected $defaultIncludes = [];

    /**
     * Transform the Timekeeping entity.
     *
     * @param ExpectedTime $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeExpectedTimeDetail(ExpectedTime $expectedTime)
    {
        return $this->collection($expectedTime->expectedTimeDetail, new ExpectedTimeDetailTransformer, 'ExpectedTimeDetail');
    }
}
