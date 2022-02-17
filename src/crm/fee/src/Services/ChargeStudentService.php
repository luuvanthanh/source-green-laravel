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

        if ($data->failed()) {
            $message = 'Có lỗi từ api Clover';

            if (isset(json_decode($data->body())->error) && isset(json_decode($data->body())->error->message)) {
                $message = 'Clover: ' . json_decode($data->body())->error->message;
            }

            throw new HttpException($data->status(), $message);
        }

        $data = json_decode($data->body(), true);

        return $data;
    }
}
