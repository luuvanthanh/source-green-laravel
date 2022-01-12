<?php

namespace GGPHP\Tariff\ConfigContent\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class ConfigContentDetailTransformer extends BaseTransformer
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
    protected $availableIncludes = [];

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
}
