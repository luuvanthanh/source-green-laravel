<?php

namespace GGPHP\Camera\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AiApiServices
{
    public static function updateCameraAiService(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/start_service';

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

    public static function onOffCameraAiService(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/turn_on_off_service';

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
