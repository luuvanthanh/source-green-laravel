<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\BranchTransformer;
use GGPHP\Crm\Category\Transformers\SearchSourceTransformer;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;
use GGPHP\Crm\Marketing\Transformers\MarketingProgramTransformer;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;
use GGPHP\Crm\Province\Transformers\TownWardTransformer;

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
    protected $availableIncludes = ['eventInfo', 'customerTag', 'reference', 'studentInfo', 'city', 'district', 'searchSource', 'statusCare', 'employee', 'branch', 'townWard', 'marketingProgram'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $sex = null;

        foreach (CustomerLead::SEX as $key => $value) {
            if (!is_null($model->sex)) {
                if ($value == $model->sex) {
                    $sex = $key;
                }
            }
        }

        return [
            'sex' => $sex,
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

    public function includeCity(CustomerLead $customerLead)
    {
        if (empty($customerLead->city)) {
            return;
        }

        return $this->item($customerLead->city, new CityTransformer, 'City');
    }

    public function includeDistrict(CustomerLead $customerLead)
    {
        if (empty($customerLead->district)) {
            return;
        }

        return $this->item($customerLead->district, new DistrictTransformer, 'District');
    }

    public function includeSearchSource(CustomerLead $customerLead)
    {
        if (empty($customerLead->searchSource)) {
            return;
        }

        return $this->item($customerLead->searchSource, new SearchSourceTransformer, 'SearchSource');
    }

    public function includeStatusCare(CustomerLead $customerLead)
    {
        return $this->collection($customerLead->statusCare, new StatusCareTransformer, 'StatusCare');
    }

    public function includeEmployee(CustomerLead $customerLead)
    {
        if (empty($customerLead->employee)) {
            return;
        }

        return $this->item($customerLead->employee, new EmployeeTransformer, 'Employee');
    }

    public function includeBranch(CustomerLead $customerLead)
    {
        if (empty($customerLead->branch)) {
            return;
        }

        return $this->item($customerLead->branch, new BranchTransformer, 'Branch');
    }

    public function includeTownWard(CustomerLead $customerLead)
    {
        if (empty($customerLead->townWard)) {
            return;
        }

        return $this->item($customerLead->townWard, new TownWardTransformer, 'TownWard');
    }

    public function includeMarketingProgram(CustomerLead $customerLead)
    {
        return $this->collection($customerLead->marketingProgram, new MarketingProgramTransformer, 'MarketingProgram');
    }
}
