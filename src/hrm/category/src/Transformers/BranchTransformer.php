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

    protected $availableIncludes = ['city'];

    public function includeCity(Branch $branch)
    {
        if (is_null($branch->city)) {
            return null;
        }

        return $this->item($branch->city, new CityTransformer, 'City');
    }
}
