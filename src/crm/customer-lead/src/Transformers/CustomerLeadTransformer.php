<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerLeadTransformer extends BaseTransformer
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
    protected $availableIncludes = ['eventInfo', 'customerTag', 'reference', 'studentInfo'];

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
            "employee_info" => json_decode($model->employee_info),
            "user_create_info" => json_decode($model->user_create_info),
        ];
    }

    public function includeReference(CustomerLead $customerLead)
    {
        if (empty($customerLead->reference)) {
            return;
        }

        return $this->item($customerLead->reference, new ReferenceTransformer, 'Reference');
    }

    public function includeEventInfo(CustomerLead $customerLead)
    {
        return $this->collection($customerLead->eventInfo, new EventInfoTransformer, 'EventInfo');
    }

    public function includeCustomerTag(CustomerLead $customerLead)
    {
        return $this->collection($customerLead->customerTag, new CustomerTagTransformer, 'CustomerTag');
    }

    public function includeStudentInfo(CustomerLead $customerLead)
    {
        return $this->collection($customerLead->studentInfo, new StudentInfoTransformer, 'StudentInfo');
    }
}
