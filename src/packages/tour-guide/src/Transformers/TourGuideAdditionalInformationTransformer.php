<?php

namespace GGPHP\TourGuide\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TourGuideAdditionalInformationTransformer.
 *
 * @package namespace GGPHP\TourGuide\Transformers;
 */
class TourGuideAdditionalInformationTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

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

        return [
            'files' => $files,
        ];
    }
}
