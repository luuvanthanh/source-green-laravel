<?php

namespace GGPHP\Camera\Listeners;

use GGPHP\Camera\Events\CameraAdded;
use GGPHP\Camera\Events\CameraUpdated;
use GGPHP\Camera\Events\CameraDeleted;
use Illuminate\Support\Facades\Redis;
use Illuminate\Contracts\Queue\ShouldQueue;
use GGPHP\Camera\Models\CameraVideoProperties;

class CameraSubscriber //implements ShouldQueue
{

    /**
     * On Camera added
     *
     * @param type $event
     * @return type
     */
    public function onCaremaAdded($event)
    {
        $camera = $event->camera;
        if (empty($camera)) {
            \Log::debug("On Camera added: Camera invalid");
            return;
        }
        \Log::debug("On Camera added");
        Redis::publish(config('constants.CAMERA.PUBLISH.PUBLISH_CHANEL', 'vmscore_to_camserver'), json_encode(
            [
                'event' => config('constants.CAMERA.PUBLISH.EVENT.ADD', 'camera_added'),
                'data' => [
                    'camera_id' => $camera->uuid,
                    'rtsp_url' => !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : '',
                    'recording_enabled' => !empty($camera->videoProperties->recording_enabled) ? $camera->videoProperties->recording_enabled : CameraVideoProperties::RECORDING_DISABLED,
                    'streaming_enabled' => !empty($camera->videoProperties->streaming_enabled) ? $camera->videoProperties->streaming_enabled : CameraVideoProperties::STREAMING_DISBALED,
                    'server_id' => !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid : ''
                ]
            ]
        ));
    }

    /**
     * On Camera updated
     *
     * @param type $event
     * @return type
     */
    public function onCaremaUpdated($event)
    {
        $camera = $event->camera;
        if (empty($camera)) {
            \Log::debug("On Camera updated: Camera invalid");
            return;
        }
        \Log::debug("On Camera updated");
        Redis::publish(config('constants.CAMERA.PUBLISH.PUBLISH_CHANEL', 'vmscore_to_camserver'), json_encode(
            [
                'event' => config('constants.CAMERA.PUBLISH.EVENT.UPDATE', 'camera_updated'),
                'data' => [
                    'camera_id' => $camera->uuid,
                    'rtsp_url' => !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : '',
                    'recording_enabled' => !empty($camera->videoProperties->recording_enabled) ? $camera->videoProperties->recording_enabled : CameraVideoProperties::RECORDING_DISABLED,
                    'streaming_enabled' => !empty($camera->videoProperties->streaming_enabled) ? $camera->videoProperties->streaming_enabled : CameraVideoProperties::STREAMING_DISBALED,
                    'server_id' => !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid : ''
                ]
            ]
        ));
    }

    /**
     * On Camera deleted
     *
     * @param type $event
     * @return type
     */
    public function onCaremaDeleted($event)
    {
        $camera = $event->camera;
        if (empty($camera)) {
            \Log::debug("On Camera deleted: Camera invalid");
            return;
        }
        \Log::debug("On Camera deleted");
        Redis::publish(config('constants.CAMERA.PUBLISH.PUBLISH_CHANEL', 'vmscore_to_camserver'), json_encode(
            [
                'event' => config('constants.CAMERA.PUBLISH.EVENT.DELETE', 'camera_removed'),
                'data' => [
                    'camera_id' => $camera->uuid,
                    'server_id' => !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid : ''
                ]
            ]
        ));
    }

    /**
     * Subscriber event
     *
     * @param type $events
     */
    public function subscribe($events)
    {
        $events->listen(
                CameraAdded::class, 'GGPHP\Camera\Listeners\CameraSubscriber@onCaremaAdded'
        );
        $events->listen(
                CameraUpdated::class, 'GGPHP\Camera\Listeners\CameraSubscriber@onCaremaUpdated'
        );
        $events->listen(
                CameraDeleted::class, 'GGPHP\Camera\Listeners\CameraSubscriber@onCaremaDeleted'
        );
    }

}
