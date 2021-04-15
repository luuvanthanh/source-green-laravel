<?php

namespace GGPHP\Fingerprint\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fingerprint\Models\Fingerprint;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class FingerprintTransformer.
 *
 * @package namespace GGPHP\Fingerprint\Transformers;
 */
class FingerprintTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['employee'];

    /**
     * Include User
     * @param  Fingerprint $fingerprint
     */
    public function includeUser(Fingerprint $fingerprint)
    {
        if (empty($fingerprint->employee)) {
            return;
        }
        return $this->item($fingerprint->employee, new UserTransformer, 'User');
    }
}
