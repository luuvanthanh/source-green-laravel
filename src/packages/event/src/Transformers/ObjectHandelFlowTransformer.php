<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Models\EventHandle;
use GGPHP\Event\Models\ObjectHandelFlow;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class EventHandleTransformer.
 *
 * @package namespace GGPHP\Event\Transformers;
 */
class ObjectHandelFlowTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['object'];

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
    public function includeObject(ObjectHandelFlow $objectHandelFlow)
    {
        if (is_null($objectHandelFlow->object)) {
            return;
        }

        return $this->item($objectHandelFlow->object, new UserTransformer, 'Object');
    }
}
