<?php

namespace GGPHP\Crm\CallCenter\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CustomerLead\Transformers\CustomerLeadTransformer;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;

/**
 * Class HistoryCallTranformer.
 *
 * @package namespace App\Transformers;
 */
class HistoryCallTranformer extends BaseTransformer
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
    protected $availableIncludes = ['customerLead', 'managerCall', 'employee'];

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

    public function customMeta(): array
    {
        return ['switchboard' => request()->switchboard_number];
    }

    public function includeCustomerLead(HistoryCall $historyCall)
    {
        if ($historyCall->loadCount('customerLead')->customer_lead_count < 1) {
            return null;
        }

        return $this->item($historyCall->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }

    public function includeManagerCall(HistoryCall $historyCall)
    {
        if ($historyCall->loadCount('managerCall')->manager_call_count < 1) {
            return null;
        }

        return $this->item($historyCall->managerCall, new ManagerCallTransformer, 'ManagerCall');
    }

    public function includeEmployee(HistoryCall $historyCall)
    {
        if ($historyCall->loadCount('employee')->employee_count < 1) {
            return null;
        }

        return $this->item($historyCall->employee, new EmployeeTransformer, 'Employee');
    }
}
