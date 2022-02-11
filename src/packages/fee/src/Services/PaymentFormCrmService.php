<?php

namespace GGPHP\Fee\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PaymentFormCrmService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/payment-forms';
    }

    public static function create($data, $token)
    {
        $params = [
            'payment_form_clover_id' => $data->Id,
            'name' => $data->Name,
            'code' => $data->Code,
            'type' => $data->Type,
        ];

        $result = Http::withToken($token)->post(self::url(), $params);

        if ($result->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                $message = 'CRM: ' . json_decode($result->body())->error->message;
            }

            throw new HttpException($result->status(), $message);
        }
    }

    public static function update($data, $id, $token)
    {
        $params = [
            'name' => $data->Name,
            'code' => $data->Code,
            'type' => $data->Type,
        ];

        $result = Http::withToken($token)->put(self::url() . '/' . $id, $params);

        if ($result->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                $message = 'CRM: ' . json_decode($result->body())->error->message;
            }

            throw new HttpException($result->status(), $message);
        }
    }
}
