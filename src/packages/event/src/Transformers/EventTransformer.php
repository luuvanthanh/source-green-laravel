<?php

namespace GGPHP\Event\Transformers;

use GGPHP\Camera\Transformers\CameraTransformer;
use GGPHP\Category\Transformers\EventTypeTransformer;
use GGPHP\Category\Transformers\TouristDestinationTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Event\Models\Event;
use GGPHP\TourGuide\Transformers\TourGuideTransformer;

/**
 * Class EventTransformer.
 *
 * @package namespace GGPHP\Event\Transformers;
 */
class EventTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['eventHandle', 'eventType', 'touristDestination', 'camera', 'tourGuide'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        //get status
        $status = null;

        foreach (Event::STATUS as $key => $value) {
            if ($value == $model->status) {
                $status = $key;
            }
        }

        //get statu detail
        $statusDetail = null;

        foreach (Event::STATUS_DETAIL as $key => $value) {
            if ($value == $model->status_detail) {
                $statusDetail = $key;
            }
        }

        //get warning level
        $warningLevel = null;

        foreach (Event::WARNING_LEVEL as $key => $value) {
            if ($value == $model->warning_level) {
                $warningLevel = $key;
            }
        }

        //get image
        $imageMedia = $model->getMedia('image');
        $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
        $image = null;

        if (!is_null($imageMedia)) {
            $image = [
                "path" => $imageMedia->getPath(),
                "name" => $imageMedia->name,
            ];
        }

        //get video
        $videoMedia = $model->getMedia('video');
        $videoMedia = $videoMedia->isEmpty() ? null : $videoMedia->first();
        $video = null;

        if (!is_null($videoMedia)) {
            $video = [
                "path" => $videoMedia->getPath(),
                "name" => $videoMedia->name,
            ];
        }

        return [
            'status' => $status,
            'status_detail' => $statusDetail,
            'warning_level' => $warningLevel,
            'image' => $image,
            'video' => $video
        ];
    }

    /**
     * Include EventAdditionalInformation
     * @param Event $fault
     */
    public function includeEventHandle(Event $event)
    {
        if (is_null($event->eventHandle)) {
            return;
        }

        return $this->item($event->eventHandle, new EventHandleTransformer, 'EventHandle');
    }

    /**
     * Include EventAdditionalInformation
     * @param Event $fault
     */
    public function includeEventType(Event $event)
    {
        if (is_null($event->eventType)) {
            return;
        }

        return $this->item($event->eventType, new EventTypeTransformer, 'EventType');
    }
    /**
     * Include EventAdditionalInformation
     * @param Event $fault
     */
    public function includeTouristDestination(Event $event)
    {
        if (is_null($event->touristDestination)) {
            return;
        }

        return $this->item($event->touristDestination, new TouristDestinationTransformer, 'TouristDestination');
    }
    /**
     * Include EventAdditionalInformation
     * @param Event $fault
     */
    public function includeCamera(Event $event)
    {
        if (is_null($event->camera)) {
            return;
        }

        return $this->item($event->camera, new CameraTransformer, 'Camera');
    }
    /**
     * Include EventAdditionalInformation
     * @param Event $fault
     */
    public function includeTourGuide(Event $event)
    {
        if (is_null($event->tourGuide)) {
            return;
        }

        return $this->item($event->tourGuide, new TourGuideTransformer, 'TourGuide');
    }
}
