<?php

namespace GGPHP\Salary\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class PayRollDetailTransformer.
 *
 * @package namespace GGPHP\Salary\Transformers;
 */
class PayrollSessionTransformer extends BaseTransformer
{
    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }
}
