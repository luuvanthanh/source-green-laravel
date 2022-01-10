<?php

namespace GGPHP\Camera\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class VmsCoreServices
{
    public static function startCamera(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/cam_start';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateCamera(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/cam_update';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function stopCamera(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/cam_stop';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function onOffRecord(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/turn_on_off_backup';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function onOffStream(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/turn_on_off_streaming';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function backupVideo(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/get_backup_video';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
