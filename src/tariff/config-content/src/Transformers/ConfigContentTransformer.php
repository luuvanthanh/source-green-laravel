<?php

namespace GGPHP\Tariff\ConfigContent\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Tariff\ConfigContent\Models\ConfigContent;
use GGPHP\Tariff\ConfigContent\Transformers\ConfigContentDetailTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class ConfigContentTransformer extends BaseTransformer
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
    protected $availableIncludes = ['configContentDetail'];

    /**
     * Transform the User entity.
     *
     * @param $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeConfigContentDetail(ConfigContent $configContent)
    {
        return $this->collection($configContent->configContentDetail, new ConfigContentDetailTransformer, 'ConfigContentDetail');
    }
}
