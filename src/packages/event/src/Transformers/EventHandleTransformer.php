<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

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
    protected $availableIncludes = [];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
