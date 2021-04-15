<?php

namespace GGPHP\Appoint\Transformers;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\StoreTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class AppointTransformer.
 *
 * @package namespace GGPHP\Appoint\Transformers;
 */
class AppointTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['appointDetails'];

    /**
     * Include appointDetails
     * @param  Appoint $appoint
     */
    public function includeAppointDetails(Appoint $appoint)
    {
        return $this->collection($appoint->appointDetails, new AppointDetailTransformer, 'AppointDetail');
    }

    /**
     * Include UserCreate
     * @param  Suggest $appoint
     */
    public function includeUserCreate(Appoint $appoint)
    {
        if (empty($appoint->employeeCreate)) {
            return;
        }

        return $this->item($appoint->employeeCreate, new UserTransformer, 'UserCreate');
    }

    /**
     * Include store
     * @param  Appoint $appoint
     */
    public function includeStore(Appoint $appoint)
    {
        if (empty($appoint->store)) {
            return;
        }

        return $this->item($appoint->store, new StoreTransformer, 'Store');
    }
}
