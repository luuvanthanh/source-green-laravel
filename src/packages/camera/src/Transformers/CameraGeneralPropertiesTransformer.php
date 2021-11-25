<?php

namespace GGPHP\Camera\Transformers;

use Carbon\Carbon;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\PermissionTransformer;
use GGPHP\RolePermission\Transformers\RoleTransformer;
use GGPHP\Collection\Models\Collection;

/**
 * Class CameraGeneralPropertiesTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraGeneralPropertiesTransformer extends BaseTransformer
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
