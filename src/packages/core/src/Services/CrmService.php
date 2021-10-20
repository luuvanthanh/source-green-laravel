<?php

namespace GGPHP\Core\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CrmService
{
    public static function createEmployee(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/employees';

        $response = Http::post($url, $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
