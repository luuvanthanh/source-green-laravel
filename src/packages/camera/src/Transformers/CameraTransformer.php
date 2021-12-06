<?php

namespace GGPHP\Camera\Transformers;

use GGPHP\Camera\Models\Camera;
use GGPHP\Collection\Models\Collection as ModelCollection;
use GGPHP\Camera\Transformers\CameraGeneralPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraNetworkPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraPtzPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraVideoPropertiesTransformer;
use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * Class CameraTransformer.
 *
 * @package namespace App\Transformers;
 */
class CameraTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['collection', 'video'];

    // protected $availableIncludes = ['collection', 'generalProperties'];
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

        $collectionId = ModelCollection::whereHas('camera', function ($query) use ($model) {
            $query->where('camera_id', $model->id);
        })->whereHas('user', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->pluck('id')->toArray();

        $permissions = new Collection();

        foreach ($collectionId as $value) {
            $permissions = $permissions->merge($user->permissions()->where('collection_id', $value)->get());
        }

        //status 
        $status = null;

        foreach (Camera::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }


        return [
            "permission_camera" => $permissions,
            "status" => $status,
        ];
    }

    /* @param Collection $collection
     * @return mixed
     */
    public function includeCollection(Camera $camera)
    {
        return $this->collection(!empty($camera->collection) ? $camera->collection : [], new CollectionTransformer, 'Collection');
    }

    /* @param General Properties $camera
     * @return mixed
     */
    public function includeGeneral(Camera $camera)
    {
        if (empty($camera->generalProperties)) {
            return;
        }

        return $this->item($camera->generalProperties, new CameraGeneralPropertiesTransformer, 'general');
    }

    /* @param Video Properties $camera
     * @return mixed
     */
    public function includeVideo(Camera $camera)
    {
        if (empty($camera->videoProperties)) {
            return;
        }

        return $this->item($camera->videoProperties, new CameraVideoPropertiesTransformer, 'video');
    }

    /* @param Network Properties $camera
     * @return mixed
     */
    public function includeNetwork(Camera $camera)
    {
        if (empty($camera->networkProperties)) {
            return;
        }

        return $this->item($camera->networkProperties, new CameraNetworkPropertiesTransformer, 'network');
    }

    /* @param Ptz Properties $camera
     * @return mixed
     */
    public function includePtz(Camera $camera)
    {
        if (empty($camera->ptzProperties)) {
            return;
        }

        return $this->item($camera->ptzProperties, new CameraPtzPropertiesTransformer, 'ptz');
    }
}
