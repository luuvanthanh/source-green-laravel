<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Clover\Transformers\EmployeeHrmTransformer;
use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Employee\Transformers\EmployeeTransformer;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class PostKnowledgeToTeachChildrenTransformer extends BaseTransformer
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
    protected $availableIncludes = ['categoryKnowledgeToTeachChildren', 'employee'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Branch 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'status' => array_search($model->status, PostKnowledgeToTeachChildren::STATUS)
        ];
    }

    public function includeCategoryKnowledgeToTeachChildren(PostKnowledgeToTeachChildren $postKnowledgeToTeachChildren)
    {
        if (is_null($postKnowledgeToTeachChildren->categoryKnowledgeToTeachChildren)) {
            return null;
        }

        return $this->item($postKnowledgeToTeachChildren->categoryKnowledgeToTeachChildren, new CategoryKnowledgeToTeachChildrenTransformer, 'CategoryKnowldgeToTeachChildren');
    }

    public function includeEmployee(PostKnowledgeToTeachChildren $postKnowledgeToTeachChildren)
    {
        if ($postKnowledgeToTeachChildren->employee) {
            return null;
        }

        return $this->item($postKnowledgeToTeachChildren->employee, new EmployeeHrmTransformer, 'Employee');
    }
}
