<?php

namespace GGPHP\Crm\CallCenter\Services;

use GGPHP\Crm\CallCenter\Services\CallCenterCMCService\CallCenterCMCService;
use Illuminate\Support\Facades\Http;

class CMCExtensionService extends CallCenterCMCService
{
    public static function createExtension($data)
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => env('URL_CMC') . '/extensions',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{}',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Accept: application/json',
                'Accept-Language: en',
                'Authorization: basic ' . env('KEY_CMC'),
                'Domain:' . env('DOMAIN'),
                'Role: user'
            ),
        ));

        $data = curl_exec($curl);
        curl_close($curl);
        return $data;
    }

    public static function deleteExtension($data)
    {
        $header = self::header();
        $url = self::url() . '/extensions' . '/' . $data->id_cmc;

        $data = Http::withHeaders($header)->delete($url);

        return $data;
    }

    public static function updateExtension($model, $params)
    {
        $header = self::header();
        $url = self::url() . '/extensions' . '/' . $model->id_cmc;

        $data = Http::withHeaders($header)->put($url, $params);

        return $data;
    }
}
