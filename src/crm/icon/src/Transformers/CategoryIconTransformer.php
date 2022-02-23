<?php

namespace GGPHP\Crm\Icon\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Icon\Models\CategoryIcon;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class CategoryIconTransformer extends BaseTransformer
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
    protected $availableIncludes = ['icon'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Icon 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeIcon(CategoryIcon $categoryIcon)
    {
        return $this->collection($categoryIcon->icon, new IconTransformer, 'Icon');
    }
}
