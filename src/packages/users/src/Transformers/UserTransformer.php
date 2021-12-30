<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\RolePermission\Transformers\PermissionTransformer;
use GGPHP\RolePermission\Transformers\RoleTransformer;
use GGPHP\VideoWall\Transformers\VideoWallTransformer;
use GGPHP\Users\Models\User;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserTransformer extends BaseTransformer
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

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'role', 'collection', 'permissionSystem', 'permission', 'videoWall'
    ];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        //get avatr
        $media = $model->getAvatar();
        $avatar = null;

        if (!is_null($media)) {
            $avatar = [
                'path' => $media->getPath(),
                'name' => $media->name,
            ];
        }

        //get status
        $status = null;

        foreach (User::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }

        return [
            'avatar' => $avatar,
            'status' => $status,
        ];
    }

    /**
     * Include Role
     * @param  User $user
     */
    public function includeRole(User $user)
    {
        return $this->collection($user->roles, new RoleTransformer, 'Role');
    }

    /**
     * Include PermissionSystem
     * @param  User $user
     */
    public function includePermissionSystem(User $user)
    {
        return $this->collection($user->permissionSystem(), new PermissionTransformer, 'PermissionSystem');
    }

    /**
     * Include Permission
     * @param  User $user
     */
    public function includePermission(User $user)
    {
        return $this->collection($user->permissions, new PermissionTransformer, 'Permission');
    }

    /**
     * Collection transformer
     *
     * @param User $user
     * @return type
     */
    public function includeCollection(User $user)
    {
        return $this->collection(empty($user->collection) ? [] : $user->collection, new CollectionTransformer, 'Collection');
    }

    /**
     * Include Role
     * @param  User $user
     */
    public function includeVideoWall(User $user)
    {
        return $this->collection($user->videoWalls, new VideoWallTransformer, 'VideoWall');
    }
}
