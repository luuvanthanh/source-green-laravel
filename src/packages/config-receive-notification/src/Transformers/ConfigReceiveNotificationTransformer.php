<?php

namespace GGPHP\ConfigReceiveNotification\Transformers;

use GGPHP\Category\Transformers\EventTypeTransformer;
use GGPHP\ConfigReceiveNotification\Models\ConfigReceiveNotification;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ConfigReceiveNotificationTransformer.
 *
 * @package namespace GGPHP\ConfigReceiveNotification\Transformers;
 */
class ConfigReceiveNotificationTransformer extends BaseTransformer
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
    protected $availableIncludes = ['eventType'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeEventType(ConfigReceiveNotification $configReceiveNotification)
    {
        if (is_null($configReceiveNotification->eventType)) {
            return;
        }

        return $this->item($configReceiveNotification->eventType, new EventTypeTransformer, 'EventType');
    }
}
