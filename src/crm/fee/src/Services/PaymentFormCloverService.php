<?php

namespace GGPHP\Crm\Fee\Services;

use GGPHP\Crm\Fee\Models\PaymentForm;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentFormCloverService
{
    public static function result()
    {
        $data = self::getPaymentForm();
        $result = self::processData($data);
        self::updateToClover($result);
    }

    public static function getToken()
    {
        return request()->bearerToken();
    }

    public static function url()
    {
        return env('URL_CLOVER');
    }

    public static function getPaymentForm()
    {
        $url = self::url() . '/api/v1/payment-forms';

        $params = [
            'PaymentFormCrmId' => true
        ];

        $data = Http::withToken(self::getToken())->get($url, $params);

        if ($data->failed()) {
            throw new HttpException($data->status(), $data->body());
        }

        $data = json_decode($data->body(), true);

        return $data;
    }

    public static function processData($data)
    {
        if (empty($data['data'])) {
            return null;
        }
        $data = $data['data'];
        $creates = [];

        foreach ($data as $items) {
            $check = PaymentForm::where('payment_form_clover_id', $items['id'])->first();

            if (is_null($check)) {
                $creates[] = [
                    'id' => Str::uuid(4),
                    'payment_form_clover_id' => $items['id'],
                    'name' => $items['attributes']['name'],
                    'code' => $items['attributes']['code'],
                    'type' => $items['attributes']['type'],
                    'is_semester' => $items['attributes']['isSemester'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($creates)) {
            PaymentForm::insert($creates);
        }

        return $creates;
    }

    public static function updateToClover($data)
    {
        if (!empty($data)) {
            $url = self::url() . '/api/v1/payment-form-crm';

            $result = Http::withToken(self::getToken())->post($url, $data);

            if ($result->failed()) {
                throw new HttpException($result->status(), $result->body());
            }
        }
    }
}
