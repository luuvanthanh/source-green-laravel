<?php

namespace GGPHP\Crm\Province\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TownWardTransformer.
 *
 * @package namespace App\Transformers;
 */
class TownWardTransformer extends BaseTransformer
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
