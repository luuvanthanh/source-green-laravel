<?php

namespace GGPHP\Crm\CallCenter\Services\CallCenterCMCService;

use Illuminate\Support\Facades\Http;

class CallCenterCMCService
{
    protected static $header;
    protected static $url;

    public static function header()
    {
        return [
            'Authorization' => 'basic ' . env('KEY_CMC'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Domain' => env('DOMAIN_CMC'),
            'Role' => env('ROLE_CMC'),
            'Accept-Language' => 'en'
        ];
    }

    public static function url()
    {
        return env('URL_CMC');
    }
}
