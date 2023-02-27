<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
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
    protected $availableIncludes = ['categoryKnowledgeToTeachChildren'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Branch 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $employee = $this->getEmployee($model);

        return [
            'employee' => $employee ? $employee->full_name : '',
            'status' => array_search($model->status,PostKnowledgeToTeachChildren::STATUS)
        ];
    }

    public function getEmployee($model)
    {
        $employee = Employee::where('employee_id_hrm', $model->employee_id)->select('full_name')->first();
        
        return $employee;
    }

    public function includeCategoryKnowledgeToTeachChildren(PostKnowledgeToTeachChildren $postKnowledgeToTeachChildren)
    {
        if (is_null($postKnowledgeToTeachChildren->categoryKnowledgeToTeachChildren)) {
            return null;
        }

        return $this->item($postKnowledgeToTeachChildren->categoryKnowledgeToTeachChildren, new CategoryKnowledgeToTeachChildrenTransformer, 'CategoryKnowldgeToTeachChildren');
    }
}
