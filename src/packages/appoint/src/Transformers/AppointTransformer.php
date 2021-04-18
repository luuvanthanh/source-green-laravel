<?php

namespace GGPHP\Appoint\Transformers;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class AppointTransformer.
 *
 * @package namespace GGPHP\Appoint\Transformers;
 */
class AppointTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    protected $defaultIncludes = ['appointDetails'];

    /**
     * Include appointDetails
     * @param  Appoint $appoint
     */
    public function includeAppointDetails(Appoint $appoint)
    {
        return $this->collection($appoint->appointDetails, new AppointDetailTransformer, 'AppointDetail');
    }
}
