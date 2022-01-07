<?php

namespace GGPHP\Camera\Transformers;

use GGPHP\Camera\Models\Camera;
use GGPHP\Collection\Models\Collection as ModelCollection;
use GGPHP\Camera\Transformers\CameraGeneralPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraNetworkPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraPtzPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraVideoPropertiesTransformer;
use GGPHP\Category\Transformers\TouristDestinationTransformer;
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

    protected $availableIncludes = ['collection', 'video', 'touristDestination'];

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

        return [
            'status' => $status,
        ];
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
}
