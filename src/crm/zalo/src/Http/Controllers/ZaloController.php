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

        $callBackUrl = 'https://84dd-14-176-232-86.ngrok.io/api/v1/zalo/zalo-callback';

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

        if (isset($data['event_name'])) {
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

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }

    public function zaloRedirect(Request $request)
    {
        return $request->all();
    }

    public function zaloFollower(Request $request)
    {
        try {
            $zaloFollowers = ZaloService::listFollower($request->all());

            return $this->success($zaloFollowers, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function zaloGetProfile(Request $request)
    {
        try {
            $zaloProfile = ZaloService::zaloGetProfile($request->all());

            return $this->success($zaloProfile, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function sendMessages(Request $request)
    {
        try {
            $sendMessage = ZaloService::sendMessages($request->all());

            return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function listRecentChat(Request $request)
    {
        try {
            $sendMessage = ZaloService::listRecentChat($request->all());

            return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function getConversation(Request $request)
    {
        try {
            $sendMessage = ZaloService::getConversation($request->all());

            return $this->success($sendMessage, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }
}
