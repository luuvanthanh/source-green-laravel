<?php

namespace GGPHP\Crm\Employee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Transformers\ExtensionTranformer;
use GGPHP\Crm\CallCenter\Transformers\ManagerCallTransformer;
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
        return [
            'total_lead' => $model->total_lead,
            'lead_new' => $model->lead_new,
            'potential' => $model->lead_potential,
            'not_potential' => $model->lead_not_potential,
            'first_call' => $model->first_call,
            'second_call' => $model->second_call,
            'third_call' => $model->third_call,
            'fourth_call' => $model->fourth_call,
            'fiveth_call' => $model->fiveth_call,
            'out_of_date' => $model->out_of_date,
            'called' => $model->called
        ];
    }

    public function customMeta(): array
    {
        return request()->total ?? [];
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
