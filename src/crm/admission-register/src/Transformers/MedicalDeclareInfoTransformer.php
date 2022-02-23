<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\MedicalDeclareInfo;
use GGPHP\Crm\Config\Transformers\ConfigMedicalDeclareTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class MedicalDeclareInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['configMedicalDeclare'];

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

    public function includeConfigMedicalDeclare(MedicalDeclareInfo $medicalDeclareInfo)
    {
        if (empty($medicalDeclareInfo->configMedicalDeclare)) {
            return;
        }
        
        return $this->item($medicalDeclareInfo->configMedicalDeclare, new ConfigMedicalDeclareTransformer, 'ConfigMedicalDeclare');
    }
}
