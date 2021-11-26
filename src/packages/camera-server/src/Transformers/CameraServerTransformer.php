<?php

namespace GGPHP\CameraServer\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraServerTransformer extends BaseTransformer
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
