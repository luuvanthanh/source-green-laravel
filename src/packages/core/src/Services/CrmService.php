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

    public static function createBranch(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/branches';

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

    public static function updateBranch(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/branches/' . $id;

        $response = Http::put($url, $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
    public static function deleteBranch($id)
    {
        $url = env('CRM_URL') . '/api/v1/branches/' . $id;

        $response = Http::delete($url);

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
