<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\ParamaterFormulaLog;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ParamaterFormulaLogTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class ParamaterFormulaLogTransformer extends BaseTransformer
{

    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [
            'Recipe' => json_decode($model->Recipe),
        ];
    }
}
