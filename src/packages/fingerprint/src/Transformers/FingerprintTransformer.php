<?php

namespace GGPHP\Fingerprint\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Fingerprint\Models\Fingerprint;

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
    protected $defaultIncludes = ['user'];

    /**
     * Include User
     * @param  Fingerprint $fingerprint
     */
    public function includeUser(Fingerprint $fingerprint)
    {
        if (empty($fingerprint->user)) {
            return;
        }
        return $this->item($fingerprint->user, new UserTransformer, 'User');
    }
}
