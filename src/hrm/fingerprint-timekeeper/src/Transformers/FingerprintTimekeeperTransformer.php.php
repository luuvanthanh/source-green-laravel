<?php

namespace GGPHP\FingerprintTimekeeper\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;

/**
 * Class FingerprintTimekeeperTransformer.
 *
 * @package namespace GGPHP\FingerprintTimekeeper\Transformers;
 */
class FingerprintTimekeeperTransformer extends BaseTransformer
{
    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];
}
