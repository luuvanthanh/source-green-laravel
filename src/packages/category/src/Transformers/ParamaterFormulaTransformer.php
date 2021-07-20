<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\ParamaterFormula;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ParamaterFormulaTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class ParamaterFormulaTransformer extends BaseTransformer
{

    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [
            "Recipe" => json_decode($model->Recipe),
        ];
    }

}
