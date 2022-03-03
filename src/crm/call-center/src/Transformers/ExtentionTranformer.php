<?php

namespace GGPHP\Crm\CallCenter\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Models\Extension;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;

/**
 * Class ExtensionTranformer.
 *
 * @package namespace App\Transformers;
 */
class ExtensionTranformer extends BaseTransformer
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
    protected $availableIncludes = ['employee'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'employee_count' => $model->employee_count
        ];
    }

    public function includeEmployee(Extension $extention)
    {
        return $this->collection($extention->employee, new EmployeeTransformer, 'Employee');
    }
}
