<?php

namespace GGPHP\Crm\Fee\Services;

use GGPHP\Crm\Fee\Models\Fee;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ChargeStudentService
{
    public static function getToken()
    {
        return request()->bearerToken();
    }

    public static function url()
    {
        return env('URL_CLOVER');
    }

    public static function moneyFeePolicie($params)
    {
        $url = self::url() . '/api/v1/money-fee-policies';
        $data = Http::withToken(self::getToken())->get($url, $params);
        // dd($data->body());
        if ($data->failed()) {
            $message = 'Có lỗi từ api Clover';
            if (isset(json_decode($data->body())->errors) && isset(json_decode($data->body())->errors[0]->detail)) {
                $message = 'Clover: ' . json_decode($data->body())->errors[0]->detail;
            }

            throw new HttpException($data->status(), $message);
        }

        $data = json_decode($data->body(), true);

        return $data;
    }
}
