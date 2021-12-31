<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\Parents;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ParentsTransformer.
 *
 * @package namespace App\Transformers;
 */
class ParentsTransformer extends BaseTransformer
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
    protected $availableIncludes = [
    ];

    /**
     * Transform the Parents entity.
     *
     * @param Parents $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
