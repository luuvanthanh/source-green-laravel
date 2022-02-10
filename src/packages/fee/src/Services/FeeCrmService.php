<?php

namespace GGPHP\Fee\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class FeeCrmService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/fees';
    }

    public static function create($data, $token)
    {
        $params = [
            'fee_clover_id' => $data->Id,
            'name' => $data->Name,
            'code' => $data->Code,
            'type' => $data->Type,
        ];

        $result = Http::withToken($token)->post(self::url(), $params);

        if ($result->failed()) {
            throw new HttpException($result->status(), $result->body());
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
            throw new HttpException($result->status(), $result->body());
        }
    }
}
