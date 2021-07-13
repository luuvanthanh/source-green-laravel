<?php

namespace App\Http\Controllers;

use App\Traits\ResponseTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Zalo\Zalo;
use Zalo\ZaloEndPoint;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ResponseTrait;

    public function zalo(Request $request)
    {
        $config = array(
            'app_id' => '176286014935476029',
            'app_secret' => 'vBRk6NCSGQIGHLW5JGVX',
            'callback_url' => 'https://87d07c9f4241.ngrok.io/zalo/',
        );

        $zalo = new Zalo($config);

        $helper = $zalo->getRedirectLoginHelper();

        $callBackUrl = "https://87d07c9f4241.ngrok.io/zalo/";

        $oauthCode = isset($_GET['code']) ? $_GET['code'] : "THIS NOT CALLBACK PAGE !!!"; // get oauthoauth code from url params
        $accessToken = $helper->getAccessToken($callBackUrl); // get access token

        if ($accessToken != null) {
            echo $accessToken;
            $expires = $accessToken->getExpiresAt(); // get expires time
            $params = ['fields' => 'id,name,birthday,gender,picture'];
            $response = $zalo->get(ZaloEndpoint::API_GRAPH_ME, $accessToken, $params);
            $result = $response->getDecodedBody(); // result
            // $params = ['offset' => 0, 'limit' => 10, 'fields' => "id, name"];
            // $response = $zalo->get(ZaloEndpoint::API_GRAPH_INVITABLE_FRIENDS, $accessToken, $params);
            // $result = $response->getDecodedBody(); // result
            echo "<pre>";
            print_r($result);
        } else {
            $loginUrl = $helper->getLoginUrl($callBackUrl); // This is login url

        }
    }

    public function webhookZalo(Request $request)
    {
        $data = $request->all();

        \Log::info('ac', $data);

    }
}
