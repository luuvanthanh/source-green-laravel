<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class ParentInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['city', 'district', 'admissionRegister'];

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

        foreach (ParentInfo::SEX as $key => $value) {

            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'sex' => $sex,
        ];
    }

    public function includeCity(ParentInfo $parentInfo)
    {
        if (empty($parentInfo->city)) {
            return;
        }

        return $this->item($parentInfo->city, new CityTransformer, 'City');
    }

    public function includeDistrict(ParentInfo $parentInfo)
    {
        if (empty($parentInfo->district)) {
            return;
        }

        return $this->item($parentInfo->district, new DistrictTransformer, 'District');
    }

    public function includeAdmissionRegister(ParentInfo $parentInfo)
    {
        if (empty($parentInfo->admissionRegister)) {
            return;
        }

        return $this->item($parentInfo->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }
}
