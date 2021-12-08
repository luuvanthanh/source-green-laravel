<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\MedicalInfo;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class MedicalInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['medicalDeclareInfo', 'childHeathDevelop', 'admissionRegister'];

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

    public function includeMedicalDeclareInfo(MedicalInfo $medicalInfo)
    {
        return $this->collection($medicalInfo->medicalDeclareInfo, new MedicalDeclareInfoTransformer, 'MedicalDeclareInfo');
    }

    public function includeChildHeathDevelop(MedicalInfo $medicalInfo)
    {
        return $this->collection($medicalInfo->childHeathDevelop, new ChildHeathDevelopTransformer, 'ChildHeathDevelop');
    }

    public function includeAdmissionRegister(MedicalInfo $medicalInfo)
    {
        if (empty($medicalInfo->admissionRegister)) {
            return;
        }

        return $this->item($medicalInfo->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }
}
