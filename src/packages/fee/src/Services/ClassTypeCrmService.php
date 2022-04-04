<?php

namespace GGPHP\Fee\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ClassTypeCrmService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/class-types';
    }

    public static function create($classType, $token)
    {
        $params = [
            'name' => $classType->Name,
            'code' => $classType->Code,
            'from' => $classType->From,
            'to' => $classType->To,
            'class_type_clover_id' => $classType->Id,
            'description' => $classType->Description
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

    public static function update($classType, $id, $token)
    {
        $params = [
            'name' => $classType->Name,
            'code' => $classType->Code,
            'from' => $classType->From,
            'to' => $classType->To,
            'description' => $classType->Description
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
