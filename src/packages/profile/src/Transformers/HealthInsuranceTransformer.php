<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\HealthInsurance;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class InsurranceTransformer.
 *
 * @package namespace App\Transformers;
 */
class HealthInsuranceTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }

    /**
     * @param HealthInsurrance $healthInsurrance
     * @return mixed
     */
    public function includeEmployee(HealthInsurance $healthInsurance)
    {
        if (empty($healthInsurance->employee)) {
            return;
        }

        return $this->item($healthInsurance->employee, new UserTransformer, 'Employee');
    }

}
