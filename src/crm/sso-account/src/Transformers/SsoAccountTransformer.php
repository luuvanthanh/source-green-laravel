<?php

namespace GGPHP\Crm\SsoAccount\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class SsoAccountTransformer extends BaseTransformer
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
}
