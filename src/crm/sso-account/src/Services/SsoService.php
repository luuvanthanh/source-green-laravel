<?php

namespace GGPHP\Crm\SsoAccount\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SsoService
{
    public static function createLeadAccount(array $attributes)
    {
        $url = env('SSO_URL') . '/api/user/lead-account';
        $bearerToken = request()->bearerToken();

        $response = Http::withToken($bearerToken)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ sso';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'Sso: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
