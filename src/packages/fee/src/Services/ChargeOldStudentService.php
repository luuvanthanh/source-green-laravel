<?php

namespace GGPHP\Fee\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ChargeOldStudentService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/update-status-charge-students';
    }

    public static function token()
    {
        return request()->bearerToken();
    }

    public static function updateStatusStudentCrm($dataCrm)
    {
        $result = Http::withToken(self::token())->post(self::url(), $dataCrm);

        if ($result->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($result->body())->errors) && isset(json_decode($result->body())->errors[0]->detail)) {
                $message = 'CRM: ' . json_decode($result->body())->errors[0]->detail;
            }

            throw new HttpException($result->status(), $message);
        }

        return json_decode($result->body());
    }
}
