<?php

namespace GGPHP\Crm\Fee\Services;

use GGPHP\Crm\Fee\Models\ClassType;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ClassTypeCloverService
{
    public static function result()
    {
        $data = self::getClassType();
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

    public static function getClassType()
    {
        $url = self::url() . '/api/v1/class-types';

        $params = [
            'classTypeCrmId' => true
        ];

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

    public static function processData($data)
    {
        if (empty($data['data'])) {
            return [];
        }
        
        $data = $data['data'];
        $creates = [];

        foreach ($data as $items) {
            $check = ClassType::where('class_type_clover_id', $items['id'])->first();

            if (is_null($check)) {
                $creates[] = [
                    'id' => Str::uuid(4),
                    'class_type_clover_id' => $items['id'],
                    'from' => $items['attributes']['from'],
                    'to' => $items['attributes']['to'],
                    'code' => $items['attributes']['code'],
                    'name' => $items['attributes']['name'],
                    'description' => $items['attributes']['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($creates)) {
            ClassType::insert($creates);
        }

        return $creates;
    }

    public static function updateToClover($data)
    {
        if (!empty($data)) {
            $url = self::url() . '/api/v1/class-type-crm';

            $result = Http::withToken(self::getToken())->post($url, $data);

            if ($result->failed()) {
                $message = 'Có lỗi từ api Clover';

                if (isset(json_decode($result->body())->errors) && isset(json_decode($result->body())->errors[0]->detail)) {
                    $message = 'Clover: ' . json_decode($result->body())->errors[0]->detail;
                }

                throw new HttpException($result->status(), $message);
            }
        }
    }
}
