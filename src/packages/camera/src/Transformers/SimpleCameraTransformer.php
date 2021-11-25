<?php

namespace GGPHP\Camera\Transformers;

use Carbon\Carbon;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Camera\Models\Camera;
use GGPHP\Contracts\Models\Contract;
use GGPHP\Collection\Transformers\CollectionTransformer;
use GGPHP\Camera\Transformers\CameraGeneralPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraVideoPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraNetworkPropertiesTransformer;
use GGPHP\Camera\Transformers\CameraPtzPropertiesTransformer;
use GGPHP\Camera\Models\CameraVideoProperties;

/**
 * Class CameraTransformer.
 *
 * @package namespace App\Transformers;
 */
class SimpleCameraTransformer extends BaseTransformer
{
    public function transform($camera)
    {
        return [
            "camera_id" => !empty($camera->uuid) ? $camera->uuid: '',
            "device_name" => !empty($camera->generalProperties->device_name) ? $camera->generalProperties->device_name: '',
            "rtsp_url" => !empty($camera->videoProperties->rtsp_url) ? $camera->videoProperties->rtsp_url : '',
            "recording_enabled" => !empty($camera->videoProperties->recording_enabled) ? $camera->videoProperties->recording_enabled : CameraVideoProperties::RECORDING_DISABLED,
            "streaming_enabled" => !empty($camera->videoProperties->streaming_enabled) ? $camera->videoProperties->streaming_enabled : CameraVideoProperties::STREAMING_DISBALED,
            "server_id" =>  !empty($camera->cameraServer->uuid) ? $camera->cameraServer->uuid: '',
        ];
    }
}
