<?php

namespace GGPHP\Crm\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class StatusParentPotentialTransformer.
 *
 * @package namespace App\Transformers;
 */
class TagTransformer extends BaseTransformer
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
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
