<?php

namespace GGPHP\ManualCalculation\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ManualCalculation\Models\ManualCalculation;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ManualCalculationTransformer.
 *
 * @package namespace GGPHP\ManualCalculation\Transformers;
 */
class ManualCalculationTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['employee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Type' => array_search($model->Type, ManualCalculation::TYPE)
        ];
    }

    /**
     * Include Employee
     * @param  ManualCalculation $manualCalculation
     */
    public function includeEmployee(ManualCalculation $manualCalculation)
    {
        if (empty($manualCalculation->employee)) {
            return;
        }

        return $this->item($manualCalculation->employee, new UserTransformer, 'Employee');
    }
}
