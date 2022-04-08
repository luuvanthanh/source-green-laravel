<?php

namespace GGPHP\Crm\Fee\Services;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;

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

            if (isset(json_decode($data->body())->errors) && isset(json_decode($data->body())->errors[0]->detail)) {
                $message = 'Clover: ' . json_decode($data->body())->errors[0]->detail;
            }

            throw new HttpException($data->status(), $message);
        }

        $data = json_decode($data->body(), true);

        return $data;
    }

    public static function syncCreateChargeStudentHrm($params)
    {
        $url = self::url() . '/api/v1/charge-old-students';

        $data = Http::withToken(self::getToken())->post($url, $params);

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

    public static function syncUpdateChargeStudentHrm($params, $id)
    {
        $url = self::url() . '/api/v1/charge-old-students/' . $id;

        $data = Http::withToken(self::getToken())->put($url, $params);

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
