<?php

namespace GGPHP\Dismissed\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class DismissedTransformer.
 *
 * @package namespace GGPHP\Dismissed\Transformers;
 */
class DismissedTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['dismissedDetails'];

    /**
     * Include dismissedDetails
     * @param  Dismissed $dismissed
     */
    public function includeDismissedDetails(Dismissed $dismissed)
    {
        return $this->collection($dismissed->dismissedDetails, new DismissedDetailTransformer, 'DismissedDetail');
    }

    /**
     * Include UserCreate
     * @param  Suggest $dismissed
     */
    public function includeUserCreate(Dismissed $dismissed)
    {
        if (empty($dismissed->userCreate)) {
            return;
        }

        return $this->item($dismissed->userCreate, new UserTransformer, 'UserCreate');
    }

    /**
     * Include store
     * @param  Dismissed $dismissed
     */
    public function includeStore(Dismissed $dismissed)
    {
        if (empty($dismissed->store)) {
            return;
        }

        return $this->item($dismissed->store, new StoreTransformer, 'Store');
    }
}
