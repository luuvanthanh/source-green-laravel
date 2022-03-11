<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\SearchSourceTransformer;
use GGPHP\Crm\CustomerLead\Transformers\CustomerLeadTransformer;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;
use GGPHP\Crm\Province\Transformers\TownWardTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentialTransformer extends BaseTransformer
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
    protected $availableIncludes = [
        'potentialStudentInfo', 'city', 'district', 'customerPotentialTag',
        'customerPotentialEventInfo', 'customerPotentialStatusCare',
        'customerPotentialReference', 'employee', 'searchSource', 'branch', 'customerLead'
    ];

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
        foreach (CustomerPotential::SEX as $key => $value) {

            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'sex' => $sex,
            'employee_info' => json_decode($model->employee_info),
            'user_create_info' => json_decode($model->user_create_info),
        ];
    }

    public function includePotentialStudentInfo(CustomerPotential $customerPotential)
    {
        return $this->collection($customerPotential->potentialStudentInfo, new PotentialStudentInfoTransformer, 'PotentialStudentInfo');
    }

    public function includeCity(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->city)) {
            return;
        }

        return $this->item($customerPotential->city, new CityTransformer, 'City');
    }

    public function includeDistrict(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->district)) {
            return;
        }

        return $this->item($customerPotential->district, new DistrictTransformer, 'District');
    }

    public function includeCustomerPotentialTag(CustomerPotential $customerPotential)
    {
        return $this->collection($customerPotential->customerPotentialTag, new CustomerPotentialTagTransformer, 'CustomerPotentialTag');
    }

    public function includeEmployee(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->employee)) {
            return;
        }

        return $this->item($customerPotential->employee, new EmployeeTransformer, 'Employee');
    }

    public function includeCustomerPotentialStatusCare(CustomerPotential $customerPotential)
    {
        return $this->collection($customerPotential->customerPotentialStatusCare, new CustomerPotentialStatusCareTransformer, 'CustomerPotentialStatusCare');
    }

    public function includeSearchSource(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->searchSource)) {
            return;
        }

        return $this->item($customerPotential->searchSource, new SearchSourceTransformer, 'SearchSource');
    }

    public function includeTownWard(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->townWard)) {
            return;
        }

        return $this->item($customerPotential->townWard, new TownWardTransformer, 'TownWard');
    }

    public function includeCustomerLead(CustomerPotential $customerPotential)
    {
        if (empty($customerPotential->customerLead)) {
            return;
        }

        return $this->item($customerPotential->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
