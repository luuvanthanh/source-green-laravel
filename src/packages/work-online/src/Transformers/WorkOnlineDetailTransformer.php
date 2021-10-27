<?php

namespace GGPHP\WorkOnline\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class WorkOnlineTransformer.
 *
 * @package namespace GGPHP\WorkOnline\Transformers;
 */
class WorkOnlineDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
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
