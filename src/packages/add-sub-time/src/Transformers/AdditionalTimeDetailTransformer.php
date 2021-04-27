<?php

namespace GGPHP\AddSubTime\Transformers;

use GGPHP\AddSubTime\Models\AddSubTimeDetail;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class AddSubTimeDetailTransformer.
 *
 * @package namespace GGPHP\ResidualTime\Transformers;
 */
class AddSubTimeDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];
    protected $defaultIncludes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }

    /**
     * Include Permission
     * @param AddSubTimeDetail $addSubTimeDetail
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(AddSubTimeDetail $addSubTimeDetail)
    {
        if (empty($addSubTimeDetail->employee)) {
            return;
        }

        return $this->item($addSubTimeDetail->employee, new UserTransformer, 'Employee');
    }
}
