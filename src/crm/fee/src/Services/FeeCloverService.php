<?php

namespace GGPHP\Crm\Fee\Services;

use GGPHP\Crm\Fee\Models\Fee;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FeeCloverService
{
    public static function result()
    {
        $data = self::getFee();
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

    public static function getFee()
    {
        $url = self::url() . '/api/v1/fees';

        $params = [
            'feeCrmId' => true
        ];

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

    public static function processData($data)
    {
        if (empty($data['data'])) {
            return [];
        }
        $data = $data['data'];
        $creates = [];

        foreach ($data as $items) {
            $check = Fee::where('fee_clover_id', $items['id'])->first();

            if (is_null($check)) {
                $creates[] = [
                    'id' => Str::uuid(4),
                    'fee_clover_id' => $items['id'],
                    'name' => $items['attributes']['name'],
                    'code' => $items['attributes']['code'],
                    'type' => $items['attributes']['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($creates)) {
            Fee::insert($creates);
        }

        return $creates;
    }

    public static function updateToClover($data)
    {
        if (!empty($data)) {
            $url = self::url() . '/api/v1/fee-crm';

            $result = Http::withToken(self::getToken())->post($url, $data);

            if ($result->failed()) {
                $message = 'Có lỗi từ api Clover';

                if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                    $message = 'Clover: ' . json_decode($result->body())->error->message;
                }

                throw new HttpException($result->status(), $message);
            }
        }
    }
}
