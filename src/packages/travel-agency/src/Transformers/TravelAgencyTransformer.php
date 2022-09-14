<?php

namespace GGPHP\TravelAgency\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TravelAgency\Models\TravelAgency;
use GGPHP\TravelAgency\Transformers\TravelAgencieTourGuideTransformer;

/**
 * Class TravelAgencyTransformer.
 *
 * @package namespace GGPHP\TravelAgency\Transformers;
 */
class TravelAgencyTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['travelAgencyAdditionalInformation'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $files = null;
        $media = $model->getMedia('files');

        if (!empty(count($media))) {
            foreach ($media as $value) {
                $files[] = [
                    'path' => $value->getPath(),
                    'file_name' => $value->name,
                ];
            }
        }

        //get locality
        $locality = null;

        foreach (TravelAgency::LOCALITY as $key => $value) {
            if ($value == $model->locality) {
                $locality = $key;
            }
        }

        //get service_type
        $serviceType = null;

        foreach (TravelAgency::SERVICE_TYPE as $key => $value) {
            if ($value == $model->service_type) {
                $serviceType = $key;
            }
        }

        return [
            'files' => $files,
            'locality' => $locality,
            'service_type' => $serviceType,
            'travel_agency_additional_information_count' =>  $model->travel_agency_additional_information_count,
            'count_tour_guide' =>  $model->travelAgencyAdditionalInformation->count(),
        ];
    }

    /**
     * Include TravelAgencyAdditionalInformation
     * @param TravelAgency $fault
     */
    public function includeTravelAgencyAdditionalInformation(TravelAgency $travelAgency)
    {

        return $this->collection($travelAgency->travelAgencyAdditionalInformation, new TravelAgencieTourGuideTransformer, 'TravelAgencyAdditionalInformation');
    }
}
