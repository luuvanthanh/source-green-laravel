<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Category\Transformers\ParamaterFormulaTransformer;
use GGPHP\Category\Transformers\ParamaterValueTransformer;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TypeOfContractTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class TypeOfContractTransformer extends BaseTransformer
{

    protected $availableIncludes = ['parameterValues', 'parameterFormulas'];

    /**
     * @param TypeOfContract $typeOfContract
     * @return mixed
     */
    public function includeParameterValues(TypeOfContract $typeOfContract)
    {
        return $this->collection($typeOfContract->parameterValues, new ParamaterValueTransformer, 'ParameterValue');
    }

    /**
     * @param TypeOfContract $typeOfContract
     * @return mixed
     */
    public function includeParameterFormulas(TypeOfContract $typeOfContract)
    {
        return $this->collection($typeOfContract->ParameterFormulas, new ParamaterFormulaTransformer, 'ParameterFormula');
    }
}
