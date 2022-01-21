<?php

namespace GGPHP\Crm\ChildDevelop\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\ChildDevelop\Models\CategorySkill;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class CategorySkillTransformer extends BaseTransformer
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
    protected $availableIncludes = ['childEvaluate'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param CategorySkill 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeChildEvaluate(CategorySkill $categorySkill)
    {
        return $this->collection($categorySkill->childEvaluate, new ChildEvaluateTransformer, 'ChildEvaluate');
    }
}
