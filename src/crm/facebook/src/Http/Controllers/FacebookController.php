<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Events\FacebookReceiveMessage;
use GGPHP\Crm\Facebook\Services\FacebookService;
use Illuminate\Http\Request;

class FacebookController extends Controller
{
    public function webhook(Request $request)
    {
        if (isset($request->hub_challenge)) {
            $challenge = $request->hub_challenge;
            $hub_verify_token = $request->hub_verify_token;
        }

        if ($hub_verify_token === env("VERIFY_TOKEN")) {
            return $challenge;
        }
    }

    public function webhookPost(Request $request)
    {
        $data = $request->all();
        \Log::info($data);

        switch ($data['object']) {
            case 'page':
                $entry = $data['entry'][0];

                if (isset($entry['messaging'])) {
                    $messaging = $entry['messaging'][0];

                    $text = null;
                    if (isset($messaging['message']) && isset($messaging['message']['text'])) {
                        $text = $messaging['message']['text'];
                    }

                    if (isset($messaging['message']) && !is_null($text)) {
                        \Log::info('send');
                        broadcast(new FacebookReceiveMessage([
                            'sender' => $messaging['sender']['id'],
                            'recipient' => $messaging['recipient']['id'],
                            'message' => $text,
                        ]));
                    }
                }
                break;
        }

        return;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageFacebook(Request $request)
    {
        $pages = FacebookService::listPages($request->all());

        return $this->success(["data" => $pages->data], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageTokenFacebook(Request $request)
    {
        $pageToken = FacebookService::pageToken($request->all());

        return $this->success(["data" => $pageToken], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageConversationFacebook(Request $request)
    {
        $pageConversation = FacebookService::pageConversation($request->all());

        return $this->success(["data" => $pageConversation->data], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageConversationMessageFacebook(Request $request)
    {
        $pageConversationMessage = FacebookService::pageConversationMessage($request->all());

        return $this->success(["data" => $pageConversationMessage->data], trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function pageConversationSendMessageFacebook(Request $request)
    {
        $mess = FacebookService::pageConversationSendMessage($request->all());

        return $this->success(["data" => $mess], trans('lang::messages.common.getListSuccess'));
    }

    public function publishPagePost(Request $request)
    {
        $mess = FacebookService::publishPagePost($request->all());

        return $this->success(["data" => $mess], trans('lang::messages.common.getListSuccess'));
    }

    public function getPagePost(Request $request)
    {
        $mess = FacebookService::getPagePost($request->all());

        return $this->success((array) $mess, trans('lang::messages.common.getListSuccess'));
    }
}
