<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Models\EventHandle;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class EventHandleTransformer.
 *
 * @package namespace GGPHP\Event\Transformers;
 */
class EventHandleTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['userEdit'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include EventAdditionalInformation
     * @param EventHandle $fault
     */
    public function includeUserEdit(EventHandle $eventHandle)
    {
        if (is_null($eventHandle->userEdit)) {
            return;
        }

        return $this->item($eventHandle->userEdit, new UserTransformer, 'UserEdit');
    }
}
