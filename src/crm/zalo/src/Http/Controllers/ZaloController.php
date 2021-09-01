<?php

namespace GGPHP\Crm\Zalo\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Zalo\Builder\MessageBuilder;
use Zalo\ZaloEndPoint;

class ZaloController extends Controller
{

    public function zalo(Request $request)
    {
        $zalo = getZaloSdk();

        $helper = $zalo->getRedirectLoginHelper();

        $callBackUrl = 'https://b876de6d9e94.ngrok.io/api/v1/zalo/zalo-callback';

        $loginUrl = $helper->getLoginUrlByPage($callBackUrl); // This is login url

        return $loginUrl;
    }

    public function zaloCallBack(Request $request)
    {
        return $request->all();
    }

    public function webhookZalo(Request $request)
    {
        $data = $request->all();

        \Log::info('ac', $data);
    }

    public function zaloRedirect(Request $request)
    {
        return $request->all();
    }

    public function zaloTest(Request $request)
    {

        $zalo = getZaloSdk();

        $access_token = "xL9S7aYNpmNhKL0HIvFF2-vKLXzJu8G0c21-TMZkdstCOKnu0FVG1j5C7tGEue0ForzZTZIOiXR3B7DpAkBf3ifjEcGTygSDtq1jI3_3yZJWOcvL9DRe0Fbg1HnIpynOaKaoCNNN-2cvRnvqR-xRFhT94rjyzkSyjr8dMK_n_pk4TG9iHl7D3PHEAnTBmSTSZr8rCbJoxZADHo98K8Za09mJTq1tlQuzhdDDNcdkroMh8KXfROQn5PL2IK4h_xeWtMLhOp_Xi2ZXLIvp8flcPiPLVWayyhjZGPFtgorDYyO4";
        // $params = ['data' => json_encode(array(
        //     'offset' => 0,
        //     'count' => 10,
        // ))];
        // $response = $zalo->get(ZaloEndPoint::API_OA_GET_LIST_FOLLOWER, $access_token, $params);

        // $params = ['data' => json_encode(array(
        //     'user_id' => '18235905065089390',
        // ))];
        // $response = $zalo->get(ZaloEndPoint::API_OA_GET_USER_PROFILE, $access_token, $params);

        // dd($response->getDecodedBody());

        // build data
        $msgBuilder = new MessageBuilder('text');
        $msgBuilder->withUserId('18235905065089390');
        $msgBuilder->withText('Message Text');

        $msgText = $msgBuilder->build();

        // send request
        $response = $zalo->post(ZaloEndpoint::API_OA_SEND_MESSAGE, $access_token, $msgText);
        $result = $response->getDecodedBody(); // result

        dd($result);
    }
}
