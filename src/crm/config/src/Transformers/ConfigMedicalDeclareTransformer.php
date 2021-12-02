<?php

namespace GGPHP\Crm\Config\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Config\Models\ConfigMedicalDeclare;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ConfigMedicalDeclareTransformer extends BaseTransformer
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
    protected $availableIncludes = ['configMedicalDeclareDetail'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Branch 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $type = null;

        foreach (ConfigMedicalDeclare::TYPE as $key => $value) {
            if ($value == $model->type) {
                $type = $key;
            }
        }
        return [
            "type" => $type
        ];
    }

    public function includeConfigMedicalDeclareDetail(ConfigMedicalDeclare $configMedicalDeclare)
    {
        return $this->collection($configMedicalDeclare->configMedicalDeclareDetail, new ConfigMedicalDeclareDetailTransformer, ' ConfigMedicalDeclareDetail');
    }
}
