<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\CategoryKnowledgeToTeachChildren;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class CategoryKnowledgeToTeachChildrenTransformer extends BaseTransformer
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
    protected $availableIncludes = ['postKnowledgeToTeachChildren'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Branch 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includepostKnowledgeToTeachChildren(CategoryKnowledgeToTeachChildren $categoryKnowledgeToTeachChildren)
    {
        return $this->collection($categoryKnowledgeToTeachChildren->postKnowledgeToTeachChildren, new PostKnowledgeToTeachChildrenTransformer, 'PostKnowledgeToTeachChildren');
    }
}
