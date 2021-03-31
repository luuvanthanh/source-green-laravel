<?php

namespace GGPHP\LateEarly\Transformers;

use GGPHP\Core\Traits\ApprovalTransformerTrait;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Models\WorkDeclaration;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class WorkDeclarationTransformer.
 *
 * @package namespace App\Transformers;
 */
class WorkDeclarationTransformer extends BaseTransformer
{
    use ApprovalTransformerTrait;

    protected $defaultIncludes = ['approval'];
    protected $availableIncludes = ['user', 'store', 'workDeclarationDetails'];

    /**
     * Include Store
     * @param LateEarly $lateEarly
     * @return \League\Fractal\Resource\Collection
     */
    public function includeWorkDeclarationDetails(WorkDeclaration $workDeclaration)
    {
        return $this->collection($workDeclaration->workDeclarationDetails, new WorkDeclarationDetailTransformer, 'WorkDeclarationDetail');
    }

    /**
     * Include user
     * @param WorkDeclaration $workDeclaration
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(WorkDeclaration $workDeclaration)
    {
        if (empty($workDeclaration->user)) {
            return;
        }

        return $this->item($workDeclaration->user, new UserTransformer, 'User');
    }

    /**
     * Include AbsentType
     * @param WorkDeclaration $lateEarly
     * @return \League\Fractal\Resource\Item
     */
    public function includeStore(WorkDeclaration $workDeclaration)
    {
        if (empty($workDeclaration->store)) {
            return;
        }

        return $this->item($workDeclaration->store, new StoreTransformer, 'Store');
    }
}
