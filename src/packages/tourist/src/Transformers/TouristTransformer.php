<?php

namespace GGPHP\Tourist\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Tourist\Models\Tourist;
use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\Category\Transformers\TouristDestinationTransformer;

/**
 * Class TouristTransformer.
 *
 * @package namespace App\Transformers;
 */
class TouristTransformer extends BaseTransformer
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
    protected $availableIncludes = ['touristDestination', 'camera'];

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
        //get image
        $imageMedia = $model->getMedia('image');
        $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
        $image = null;

        if (!is_null($imageMedia)) {
            $image = [
                'path' => $imageMedia->getPath(),
                'name' => $imageMedia->name,
            ];
        }

        //get video
        $videoMedia = $model->getMedia('video');
        $videoMedia = $videoMedia->isEmpty() ? null : $videoMedia->first();
        $video = null;

        if (!is_null($videoMedia)) {
            $video = [
                'path' => $videoMedia->getPath(),
                'name' => $videoMedia->name,
            ];
        }

        return [
            'image' => $image,
            'video' => $video
        ];
    }

    /**
     * Include touristDestination
     * @param Tourist $fault
     */
    public function includeTouristDestination(Tourist $model)
    {
        if (is_null($model->touristDestination)) {
            return;
        }

        return $this->item($model->touristDestination, new TouristDestinationTransformer, 'TouristDestination');
    }
    /**
     * Include camera
     * @param Tourist $fault
     */
    public function includeCamera(Tourist $model)
    {
        if (is_null($model->camera)) {
            return;
        }

        return $this->item($model->camera, new CameraTransformer, 'Camera');
    }
}
