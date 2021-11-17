<?php

namespace GGPHP\RolePermission\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Models\Permission;
use GGPHP\RolePermission\Transformers\RoleTransformer;

/**
 * Class PermissionTransformer.
 *
 * @package namespace App\Transformers;
 */
class PermissionTransformer extends BaseTransformer
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
    protected $availableIncludes = ['role'];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {

        return [
            'name' => $model->name,
            'description' => $model->description,
            'group' => $model->group,
            'is_system' => $model->is_system,
            'group_slug' => $model->group_slug,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
            'collection_id' => $model->pivot->collection_id,
        ];
    }

    /**
     * Include Role
     * @param  Permission $permission
     */
    public function includeRole(Permission $permission)
    {
        return $this->collection($permission->roles, new RoleTransformer, 'Role');
    }
}
