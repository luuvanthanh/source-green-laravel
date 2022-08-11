<?php

namespace GGPHP\NumberOfTourist\Transformers;

use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\Category\Transformers\TouristDestinationTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\NumberOfTourist\Models\NumberOfTourist;

/**
 * Class NumberOfTouristTransformer.
 *
 * @package namespace GGPHP\NumberOfTourist\Transformers;
 */
class NumberOfTouristTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['touristDestination', 'camera'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {


        return [];
    }

    /**
     * Include NumberOfTouristAdditionalInformation
     * @param NumberOfTourist $fault
     */
    public function includeTouristDestination(NumberOfTourist $numberOfTourist)
    {
        if (is_null($numberOfTourist->touristDestination)) {
            return;
        }

        return $this->item($numberOfTourist->touristDestination, new TouristDestinationTransformer, 'TouristDestination');
    }

    /**
     * Include NumberOfTouristAdditionalInformation
     * @param NumberOfTourist $fault
     */
    public function includeCamera(NumberOfTourist $numberOfTourist)
    {
        if (is_null($numberOfTourist->camera)) {
            return;
        }

        return $this->item($numberOfTourist->camera, new CameraTransformer, 'Camera');
    }
}
