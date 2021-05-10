<?php

namespace GGPHP\MagneticCard\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\MagneticCard\Models\MagneticCard;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class MagneticCardTransformer.
 *
 * @package namespace GGPHP\MagneticCard\Transformers;
 */
class MagneticCardTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['user'];

    /**
     * Include User
     * @param  MagneticCard $magneticCard
     */
    public function includeUser(MagneticCard $magneticCard)
    {
        if (empty($magneticCard->user)) {
            return;
        }
        return $this->item($magneticCard->user, new UserTransformer, 'User');
    }
}
