<?php

namespace GGPHP\TourGuide\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TourGuide\Models\TourGuide;

/**
 * Class TourGuideTransformer.
 *
 * @package namespace GGPHP\TourGuide\Transformers;
 */
class TourGuideTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['tourGuideAdditionalInformation', 'cardType', 'language', 'objectType'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $media = $model->getAvatar();
        $avatar = null;

        if (!is_null($media)) {
            $avatar = [
                "path" => $media->getPath(),
                "name" => $media->name,
            ];
        }

        return [
            "avatar" => $avatar
        ];
    }

    /**
     * Include TourGuideAdditionalInformation
     * @param TourGuide $fault
     */
    public function includeTourGuideAdditionalInformation(TourGuide $tourGuide)
    {

        return $this->collection($tourGuide->tourGuideAdditionalInformation, new TourGuideAdditionalInformationTransformer, 'TourGuideAdditionalInformation');
    }

    /**
     * Include CardType
     * @param TourGuide $fault
     */
    public function includeCardType(TourGuide $tourGuide)
    {
        if (is_null($tourGuide->cardType)) {
            return;
        }

        return $this->item($tourGuide->cardType, new CardTypeTransformer, 'CardType');
    }

    /**
     * Include Language
     * @param TourGuide $fault
     */
    public function includeLanguage(TourGuide $tourGuide)
    {
        if (is_null($tourGuide->language)) {
            return;
        }

        return $this->item($tourGuide->language, new LanguageTransformer, 'Language');
    }

    /**
     * Include ObjectType
     * @param TourGuide $fault
     */
    public function includeObjectType(TourGuide $tourGuide)
    {
        if (is_null($tourGuide->objectType)) {
            return;
        }

        return $this->item($tourGuide->objectType, new ObjectTypeTransformer, 'ObjectType');
    }
}
