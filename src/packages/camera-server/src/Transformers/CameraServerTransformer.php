<?php

namespace GGPHP\CameraServer\Transformers;

use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use GGPHP\Users\Transformers\UserTransformer;
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

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['user', 'camera'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        //status 
        $status = null;

        foreach (CameraServer::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }

        return [
            'status' => $status,
        ];
    }

    /**
     * Load user
     *
     * @param CameraServer $item
     * @return type
     */
    public function includeUser(CameraServer $cameraServer)
    {
        if (is_null($cameraServer->user)) {
            return;
        }

        return $this->item($cameraServer->user, new UserTransformer, 'User');
    }

    /**
     * Load cameras
     *
     * @param CameraServer $item
     * @return type
     */
    public function includeCamera(CameraServer $cameraServer)
    {
        return $this->collection($cameraServer->camera, new CameraTransformer, 'Camera');
    }
}
