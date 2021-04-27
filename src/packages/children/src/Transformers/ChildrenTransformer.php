<?php

namespace GGPHP\Children\Transformers;

use GGPHP\Children\Models\Children;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ChildrenTransformer.
 *
 * @package namespace GGPHP\Children\Transformers;
 */
class ChildrenTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['employee'];
    protected $availableIncludes = [];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Months' => $model->months,
        ];
    }

    /**
     * Include Employee
     * @param Children $children
     */
    public function includeEmployee(Children $children)
    {
        return $this->item($children->employee, new UserTransformer, 'Employee');
    }

}
