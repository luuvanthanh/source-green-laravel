<?php

namespace GGPHP\RolePermission\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use Spatie\Permission\Models\Role;

/**
 * Class RolesTransformer.
 *
 * @package namespace App\Transformers;
 */
class RoleTransformer extends BaseTransformer
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
    protected $availableIncludes = ['permission'];

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
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }

    /**
     * Include Permission
     * @param  Store $store
     */
    public function includePermission(Role $role)
    {
        return $this->collection($role->permissions, new PermissionTransformer, 'Permission');
    }

}
