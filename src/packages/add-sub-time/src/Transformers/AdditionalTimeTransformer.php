<?php

namespace GGPHP\AddSubTime\Transformers;

use GGPHP\AddSubTime\Models\AddSubTime;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use League\Fractal\Resource\Collection;

/**
 * Class AddSubTimeTransformer.
 *
 * @package namespace GGPHP\AddSubTime\Transformers;
 */
class AddSubTimeTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['user'];
    protected $defaultIncludes = ['addSubTimeDetail'];

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
     * @param AddSubTime $addSubTime
     * @return Collection
     */
    public function includeAddSubTimeDetail(AddSubTime $addSubTime)
    {
        return $this->collection($addSubTime->addSubTimeDetail, new AddSubTimeDetailTransformer, 'AddSubTimeDetail');
    }

    /**
     * Include Permission
     * @param AddSubTime $addSubTime
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(AddSubTime $addSubTime)
    {
        if (empty($addSubTime->user)) {
            return;
        }

        return $this->item($addSubTime->user, new UserTransformer, 'User');
    }
}
