<?php

namespace GGPHP\Dismissed\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Dismissed\Models\Dismissed;

/**
 * Class DismissedTransformer.
 *
 * @package namespace GGPHP\Dismissed\Transformers;
 */
class DismissedTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['dismissedDetails'];

    /**
     * Include dismissedDetails
     * @param  Dismissed $dismissed
     */
    public function includeDismissedDetails(Dismissed $dismissed)
    {
        return $this->collection($dismissed->dismissedDetails, new DismissedDetailTransformer, 'DismissedDetail');
    }
}
