<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Models\ProfileInfo;
use GGPHP\Crm\Config\Transformers\ConfigProfileInfoTransformer;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class ProfileInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['admissionRegister', 'configProfileInfo'];

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

    public function includeAdmissionRegister(ProfileInfo $profileInfo)
    {
        if (empty($profileInfo->admissionRegister)) {
            return;
        }

        return $this->item($profileInfo->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }

    public function includeConfigProfileInfo(ProfileInfo $profileInfo)
    {
        if (empty($profileInfo->configProfileInfo)) {
            return;
        }

        return $this->item($profileInfo->configProfileInfo, new ConfigProfileInfoTransformer, 'ConfigProfileInfo');
    }
}
