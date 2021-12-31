<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Branch;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class BranchTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class BranchTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
}
