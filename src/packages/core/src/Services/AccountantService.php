<?php

namespace GGPHP\Core\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AccountantService
{
    public static function createEmployee(array $attributes)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/sync-master';
        $bearerToken = request()->bearerToken();
        $response = Http::withToken("$bearerToken")->post("$url", $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateEmployee(array $attributes)
    {
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/sync-master';
        $bearerToken = request()->bearerToken();
        $response = Http::withToken("$bearerToken")->put("$url", $attributes);
        
        if ($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteEmployee($id)
    {
        $bearerToken = request()->bearerToken();
        $url = env('ACCOUNTANT_URL') . '/api/app/business-object/sync-master' . $id;

        $response = Http::withToken("$bearerToken")->delete("$url");

        if ($response->failed()) {
            $message = "Có lỗi từ api kế toán";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "Kế toán: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return true;
    }
}
