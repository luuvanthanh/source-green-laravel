<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;

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
    protected $availableIncludes = ['potentialStudentInfo', 'city', 'district', 'customerPotentialTag', 'customerPotentialEventInfo'];

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
            "user_create_info" => json_decode($model->user_create_info),
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

    public function includeCustomerPotentialEventInfo(CustomerPotential $customerPotential)
    {
        return $this->collection($customerPotential->customerPotentialEventInfo, new CustomerPotentialEventInfoTransformer, 'CustomerPotentialEventInfo');
    }
}
