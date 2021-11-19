<?php

namespace GGPHP\TravelAgency\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TravelAgency\Models\TravelAgency;

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
                    "path" => $value->getPath(),
                    "file_name" => $value->name,
                ];
            }
        }

        return [
            'files' => $files,
        ];
    }

    /**
     * Include TravelAgencyAdditionalInformation
     * @param TravelAgency $fault
     */
    public function includeTravelAgencyAdditionalInformation(TravelAgency $travelAgency)
    {

        return $this->collection($travelAgency->travelAgencyAdditionalInformation, new TravelAgencyAdditionalInformationTransformer, 'TravelAgencyAdditionalInformation');
    }
}
