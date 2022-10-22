<?php

namespace GGPHP\Camera\Transformers;

use GGPHP\Camera\Models\Camera;
use GGPHP\Category\Transformers\TouristDestinationTransformer;
use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Models\User;

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

    protected $availableIncludes = ['collection', 'touristDestination', 'cameraServer'];

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
        //status 
        $status = null;

        foreach (Camera::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }

        $attributes['status'] = $status;

        if (request()->route()->getName() != 'cameras-share') {
            $urlStream = env('MEDIA_URL') . '/live' . '/' . $model->id . '.flv';
            $attributes['url_stream'] = $urlStream;
        }

        $attributes['service_active'] = $model->cameraService->where('is_on', true)->count();

        return $attributes;
    }

    /* @param Collection $collection
     * @return mixed
     */
    public function includeCollection(Camera $camera)
    {
        return $this->collection(!empty($camera->collection) ? $camera->collection : [], new CollectionTransformer, 'Collection');
    }

    /* @param Ptz Properties $camera
     * @return mixed
     */
    public function includeTouristDestination(Camera $camera)
    {
        if (empty($camera->touristDestination)) {
            return;
        }

        return $this->item($camera->touristDestination, new TouristDestinationTransformer, 'TouristDestination');
    }

    /* @param Ptz Properties $camera
     * @return mixed
     */
    public function includeCameraServer(Camera $camera)
    {
        if (empty($camera->cameraServer)) {
            return;
        }

        return $this->item($camera->cameraServer, new CameraServerTransformer, 'CameraServer');
    }
}
