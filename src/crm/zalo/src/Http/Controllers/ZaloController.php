<?php

namespace GGPHP\Crm\Zalo\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Zalo\Events\ZaloReceiveMessage;
use GGPHP\Crm\Zalo\Services\ZaloService;
use Illuminate\Http\Request;

class ZaloController extends Controller
{

    public function zalo(Request $request)
    {
        $zalo = getZaloSdk();

        $helper = $zalo->getRedirectLoginHelper();

        $callBackUrl = 'https://fdbb-118-70-192-53.ngrok.io/api/v1/zalo/zalo-callback';

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

        switch ($data['event_name']) {
            case 'user_send_text':
                    $messaging = $data['message']['text'];
                    \Log::info('send', $data);
                    \Log::info('send-zalo');
                        broadcast(new ZaloReceiveMessage([
                            'sender' => $data['sender']['id'],
                            'recipient' => $data['recipient']['id'],
                            'message' => $messaging,
                        ]));
                break;
            default:
                # code...
                break;
        }
    }

    public function zaloRedirect(Request $request)
    {
        return $request->all();
    }

    public function zaloFollower(Request $request)
    {
        $zaloFollowers = ZaloService::listFollower($request->all());

        return $this->success($zaloFollowers, trans('lang::messages.common.getListSuccess'));
    }

    public function zaloGetProfile(Request $request)
    {
        $zaloProfile = ZaloService::zaloGetProfile($request->all());

        return $this->success($zaloProfile, trans('lang::messages.common.getListSuccess'));
    }

    public function sendMessages(Request $request)
    {
        $sendMessage = ZaloService::sendMessages($request->all());

        return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
    }

    public function listRecentChat(Request $request)
    {
        $sendMessage = ZaloService::listRecentChat($request->all());

        return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
    }

    public function getConversation(Request $request)
    {
        $sendMessage = ZaloService::getConversation($request->all());

        return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
    }
}
