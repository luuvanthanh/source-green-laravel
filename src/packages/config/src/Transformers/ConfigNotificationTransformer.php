<?php

namespace GGPHP\Config\Transformers;

use GGPHP\Config\Models\ConfigNotification;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ConfigTransformer.
 *
 * @package namespace GGPHP\Config\Transformers;
 */
class ConfigNotificationTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [
            'Type' => array_search($model->Type, ConfigNotification::TYPE)
        ];
    }
}
