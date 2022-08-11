<?php

namespace GGPHP\TravelAgency\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TourGuide\Transformers\TourGuideTransformer;
use GGPHP\TravelAgency\Models\TravelAgencieTourGuide;

/**
 * Class TravelAgencieTourGuideTransformer.
 *
 * @package namespace GGPHP\TravelAgencieTourGuide\Transformers;
 */
class TravelAgencieTourGuideTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['tourGuide'];

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
     * Include TourGuide
     * @param TravelAgencieTourGuide $fault
     */
    public function includeTourGuide(TravelAgencieTourGuide $travelAgencieTourGuide)
    {
        if (is_null($travelAgencieTourGuide->tourGuide)) {
            return;
        }

        return $this->item($travelAgencieTourGuide->tourGuide, new TourGuideTransformer, 'TourGuide');
    }
}
