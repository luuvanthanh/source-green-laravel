<?php

namespace GGPHP\Crm\Employee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Transformers\ExtensionTranformer;
use GGPHP\Crm\CallCenter\Transformers\ManagerCallTransformer;
use GGPHP\Crm\CallCenter\Transformers\SaleTransformer;
use GGPHP\Crm\Employee\Models\Employee;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class EmployeeTransformer extends BaseTransformer
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
    protected $availableIncludes = ['managerCall', 'extension'];

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

    public function includeManagerCall(Employee $employee)
    {
        return $this->collection($employee->managerCall, new ManagerCallTransformer, 'ManagerCall');
    }

    public function includeExtension(Employee $employee)
    {
        return $this->collection($employee->extension, new ExtensionTranformer, 'Extension');
    }
}
