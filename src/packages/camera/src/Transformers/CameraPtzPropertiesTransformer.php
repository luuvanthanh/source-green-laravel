<?php

namespace GGPHP\Camera\Transformers;

use Carbon\Carbon;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\PermissionTransformer;
use GGPHP\RolePermission\Transformers\RoleTransformer;
use GGPHP\Collection\Models\Collection;
use GGPHP\Camera\Models\CameraPtzProperties;

/**
 * Class CameraPtzPropertiesTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraPtzPropertiesTransformer extends BaseTransformer
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

    public function transform($model)
    {
        return [
            'id' => $model->id,
            'camera_id' => $model->camera_id,
            'zoom_enabled' => (int) $model->zoom_enabled,
            'pan_enabled' => (int) $model->pan_enabled,
            'tilt_enabled' => (int) $model->tilt_enabled,
            'zoom_val' => (int) $model->zoom_val,
            'pan_val' => (int) $model->pan_val,
            'tilt_val' => (int) $model->tilt_val
        ];
    }
}
