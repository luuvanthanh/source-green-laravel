<?php

namespace GGPHP\CameraServer\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class VmsCoreServices
{
    public static function activatedVmsCore($attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/start';

        $response = Http::asForm()->post($url, $attributes);

        if ($response->failed()) {
            dd($response->body());
            $message = 'Có lỗi từ api vms-core';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Vms-core: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deactivationVmsCore(array $attributes)
    {
        $url = env('VMS_CORE_URL') . '/vms_core/stop';

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
