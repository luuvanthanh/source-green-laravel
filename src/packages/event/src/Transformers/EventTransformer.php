<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Models\Event;

/**
 * Class EventTransformer.
 *
 * @package namespace GGPHP\Event\Transformers;
 */
class EventTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['eventHandle'];

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
     * @param Event $fault
     */
    public function includeEventHandle(Event $event)
    {
        if (!is_null($event->eventHandle)) {
            return;
        }

        return $this->item($event->eventHandle, new EventHandleTransformer, 'EventHandle');
    }
}
