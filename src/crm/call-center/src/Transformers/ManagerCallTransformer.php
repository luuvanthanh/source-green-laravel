<?php

namespace GGPHP\Crm\CallCenter\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CustomerLead\Transformers\CustomerLeadTransformer;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;

/**
 * Class SaleTransformer.
 *
 * @package namespace App\Transformers;
 */
class ManagerCallTransformer extends BaseTransformer
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
    protected $availableIncludes = ['historyCall', 'customerLead', 'employee'];

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
            'status' => array_search($model->status, $model::STATUS) ? array_search($model->status, $model::STATUS) : null,
            'call_time' => array_search($model->call_times, $model::CALLTIME) ? array_search($model->call_times, $model::CALLTIME) : null
        ];
    }

    public function customMeta(): array
    {
        return [];
    }

    public function includeHistoryCall(ManagerCall $managerCall)
    {
        return $this->collection($managerCall->historyCall, new HistoryCallTranformer, 'HistoryCall');
    }

    public function includeCustomerLead(ManagerCall $managerCall)
    {
        if ($managerCall->loadCount('customerLead')->customer_lead_count < 1) {
            return null;
        }

        return $this->item($managerCall->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }

    public function includeEmployee(ManagerCall $managerCall)
    {
        if ($managerCall->loadCount('employee')->employee_count < 1) {
            return null;
        }

        return $this->item($managerCall->employee, new EmployeeTransformer, 'Employee');
    }
}
