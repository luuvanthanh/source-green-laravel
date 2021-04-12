<?php

namespace GGPHP\SalaryIncrease\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class SalaryIncreaseTransformer.
 *
 * @package namespace GGPHP\SalaryIncrease\Transformers;
 */
class SalaryIncreaseTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];

    protected $defaultIncludes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $parameterValues = $model->parameterValues;

        return [
            "parameter_values" => $parameterValues,
        ];
    }

    /**
     * Include employee
     * @param  SalaryIncrease $salaryIncrease
     */
    public function includeEmployee(SalaryIncrease $salaryIncrease)
    {
        if (empty($salaryIncrease->employee)) {
            return;
        }

        return $this->item($salaryIncrease->employee, new UserTransformer, 'Employee');
    }
}
