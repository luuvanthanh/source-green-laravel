<?php

namespace GGPHP\Crm\CallCenter\Services;

use GGPHP\Crm\CallCenter\Services\CallCenterCMCService\CallCenterCMCService;
use Illuminate\Support\Facades\Http;

class CMCHistoryCallService extends CallCenterCMCService
{

    public static function logCallInbound($uuid)
    {
        $header = self::header();
        $url = self::url() . '/call-logs/inbound';

        $milisecond = strtotime('now') * 1000;

        $params = [
            'queryTime' => $milisecond,
            'pages' => 1
        ];

        $result = Http::withHeaders($header)->post($url, $params);

        $data = json_decode($result->body(), true);

        $data = collect($data['data']['items']);

        if ($data->isNotEmpty()) {
            $call = $data->first(function ($item, $key) use ($uuid) {
                return $item['uuid'] == $uuid;
            });
        } else {
            $call = null;
        }

        return $call;
    }
}
