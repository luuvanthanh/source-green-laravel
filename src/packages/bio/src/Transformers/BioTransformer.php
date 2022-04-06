<?php

namespace GGPHP\Bio\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Bio\Models\Bio;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class BioTransformer.
 *
 * @package namespace GGPHP\Bio\Transformers;
 */
class BioTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['employee'];

    /**
     * Include Employee
     * @param  Bio $bio
     */
    public function includeEmployee(Bio $bio)
    {
        if (empty($bio->employee)) {
            return;
        }

        return $this->item($bio->employee, new UserTransformer, 'Employee');
    }
}
