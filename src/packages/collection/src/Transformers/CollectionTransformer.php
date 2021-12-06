<?php

namespace GGPHP\Collection\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use GGPHP\Collection\Models\Collection;
use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use Illuminate\Support\Facades\Auth;

/**
 * Class CollectionTransformer.
 *
 * @package namespace App\Transformers;
 */
class CollectionTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['camera', 'users'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        $user = User::findOrFail(Auth::id());

        $permissions = $user->permissions()->where('collection_id', $model->id)->get();

        return [
            "permission_collection" => $permissions,
        ];
    }

    /**
     * Load cameras
     *
     * @param Collection $item
     * @return type
     */
    public function includeCamera(Collection $collection)
    {
        if (empty($collection->camera)) {
            return;
        }

        return $this->collection($collection->camera, new CameraTransformer, 'Camera');
    }

    /**
     * Load users
     *
     * @param Collection $item
     * @return type
     */
    public function includeUsers(Collection $collection)
    {
        if (empty($collection->user)) {
            return;
        }

        foreach ($collection->user as $key => &$value) {
            $value->collection_id = $collection->id;
        }

        return $this->collection($collection->user, new UserTransformer, 'User');
    }
}
