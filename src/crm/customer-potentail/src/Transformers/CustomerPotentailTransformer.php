<?php

namespace GGPHP\Crm\CustomerPotentail\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentail;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentailTransformer extends BaseTransformer
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
    protected $availableIncludes = ['potentailStudentInfo', 'city', 'district', 'customerPotentailTag'];

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
        foreach (CustomerPotentail::SEX as $key => $value) {

            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'sex' => $sex,
            "user_create_info" => json_decode($model->user_create_info),
        ];
    }

    public function includePotentailStudentInfo(CustomerPotentail $customerPotentail)
    {
        return $this->collection($customerPotentail->potentailStudentInfo, new PotentailStudentInfoTransformer, 'PotentailStudentInfo');
    }

    public function includeCity(CustomerPotentail $customerPotentail)
    {
        if (empty($customerPotentail->city)) {
            return;
        }

        return $this->item($customerPotentail->city, new CityTransformer, 'City');
    }

    public function includeDistrict(CustomerPotentail $customerPotentail)
    {
        if (empty($customerPotentail->district)) {
            return;
        }

        return $this->item($customerPotentail->district, new DistrictTransformer, 'District');
    }

    public function includeCustomerPotentailTag(CustomerPotentail $customerPotentail)
    {
        return $this->collection($customerPotentail->customerPotentailTag, new CustomerPotentailTagTransformer, 'CustomerPotentailTag');
    }
}
