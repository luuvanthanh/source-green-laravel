<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestInputTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee', 'admissionRegister'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeEmployee(TestInput $testInput)
    {
        if (empty($testInput->employee)) {
            return;
        }

        return $this->item($testInput->employee, new EmployeeTransformer, 'Employee');
    }

    public function includeAdmissionRegister(TestInput $testInput)
    {
        if (empty($testInput->admissionRegister)) {
            return;
        }

        return $this->item($testInput->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }
}
