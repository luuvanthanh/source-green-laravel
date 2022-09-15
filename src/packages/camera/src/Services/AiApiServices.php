<?php

namespace GGPHP\Camera\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AiApiServices
{
    public static function updateCameraAiService(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/ai_core/add_ai_service';

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

    public static function onCameraAiService($url, array $attributes)
    {
        $url = $url . '/ai_core/add_ai_service';

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

    public static function offCameraAiService($url, array $attributes)
    {
        $url = $url . '/ai_core/remove_ai_service';

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
