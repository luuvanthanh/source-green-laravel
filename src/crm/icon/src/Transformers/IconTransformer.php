<?php

namespace GGPHP\Crm\Icon\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Icon\Models\Icon;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class IconTransformer extends BaseTransformer
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
    protected $availableIncludes = ['categoryIcon'];

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

    public function includeCategoryIcon(Icon $icon)
    {
        if (empty($icon->categoryIcon)) {
            return;
        }

        return $this->item($icon->categoryIcon, new CategoryIconTransformer, 'CategoryIcon');
    }
}
