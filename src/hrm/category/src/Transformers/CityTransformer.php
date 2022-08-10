<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CityTransformer extends BaseTransformer
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
}
