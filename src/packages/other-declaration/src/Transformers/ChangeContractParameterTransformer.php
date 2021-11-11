<?php

namespace GGPHP\OtherDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\OtherDeclaration\Models\ChangeContractParameter;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ChangeContractParameterTransformer.
 *
 * @package namespace GGPHP\OtherDeclaration\Transformers;
 */
class ChangeContractParameterTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee'];

    public function customAttributes($model): array
    {
        return [
            "Detail" => json_decode($model->Detail),
        ];
    }

    /**
     * Include User
     * @param  ChangeContractParameter $changeContractParameter
     */
    public function includeEmployee(ChangeContractParameter $changeContractParameter)
    {
        if (empty($changeContractParameter->employee)) {
            return;
        }

        return $this->item($changeContractParameter->employee, new UserTransformer, 'Employee');
    }
}
