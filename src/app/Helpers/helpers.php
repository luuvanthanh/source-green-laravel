<?php

use Illuminate\Support\Facades\Http;

if (!function_exists('token_csdl')) {
    function token_csdl()
    {
        $url = env('URL_SYNC_DATA') . '/uaa/oauth/token';
        $source = Http::asForm()->withHeaders([
            'Authorization' => 'Basic bGdzcDpvYXV0aDJjb25uZWN0QHVuaXRlY2g=',
        ])->post($url, [
            'scope' => 'token',
            'username' => 'lgspconnect',
            'password' => 'lgspconnect@un1t3ch2022#19',
            'grant_type' => 'password',
        ]);

        if ($source->status() != 200) {
            throw new Exception($source->body(), $source->status());
        }

        $data = json_decode($source->body(), true);

        return $data['access_token'];
    }
}
