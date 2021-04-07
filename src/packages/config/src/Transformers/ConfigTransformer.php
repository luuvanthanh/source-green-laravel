<?php

namespace GGPHP\Config\Transformers;

use GGPHP\Config\Models\Config;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ConfigTransformer.
 *
 * @package namespace GGPHP\Config\Transformers;
 */
class ConfigTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

}
