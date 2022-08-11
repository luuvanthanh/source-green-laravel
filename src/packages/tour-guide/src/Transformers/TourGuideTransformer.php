<?php

namespace GGPHP\TourGuide\Transformers;

use GGPHP\Category\Transformers\CardTypeTransformer;
use GGPHP\Category\Transformers\LanguageTransformer;
use GGPHP\Category\Transformers\ObjectTypeTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Transformers\EventTransformer;
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
    protected $availableIncludes = ['tourGuideAdditionalInformation', 'cardType', 'language', 'objectType', 'event'];

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
                'path' => $media->getPath(),
                'name' => $media->name,
            ];
        }

        //get type
        $type = null;

        foreach (TourGuide::TYPE as $key => $value) {
            if ($value == $model->type) {
                $type = $key;
            }
        }

        //sex
        $sex = null;

        foreach (TourGuide::SEX as $key => $value) {
            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'avatar' => $avatar,
            'avatar_url' => !is_null($avatar) ? $avatar['path'] : $avatar,
            'type' => $type,
            'sex' => $sex,
            'event_count' => $model->event_count
        ];
    }

    /**
     * Include TourGuideAdditionalInformation
     * @param TourGuide $fault
     */
    public function includeTourGuideAdditionalInformation(TourGuide $tourGuide)
    {
        if (is_null($tourGuide->tourGuideAdditionalInformation)) {
            return;
        }

        return $this->item($tourGuide->tourGuideAdditionalInformation, new TourGuideAdditionalInformationTransformer, 'TourGuideAdditionalInformation');
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

    /**
     * Include Event
     * @param TourGuide $fault
     */
    public function includeEvent(TourGuide $tourGuide)
    {
        return $this->collection($tourGuide->event, new EventTransformer, 'Event');
    }
}
