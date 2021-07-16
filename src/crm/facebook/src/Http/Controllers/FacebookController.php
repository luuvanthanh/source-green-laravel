<?php

namespace GGPHP\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Facebook\Events\FacebookReceiveMessage;
use GGPHP\Facebook\Services\FacebookService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

        switch ($data['object']) {
            case 'page':
                $entry = $data['entry'][0];

                if (isset($entry['messaging'])) {
                    $messaging = $entry['messaging'][0];

                    $text = isset($messaging['message']) ? $messaging['message']['text'] : null;

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

        $dataPageConversation = $pageConversation->data;
        // foreach ($dataPageConversation as $key => $conversation) {
        //     $data = [];
        //     foreach ($conversation->senders->data as $key => $value) {

        //         $avatar = null;
        //         if ($value->id != $request->page_id) {
        //             $profile_pic = FacebookService::profilePic([
        //                 "user_id" => $value->id,
        //                 "page_access_token" => $request->page_access_token,
        //             ]);

        //             $avatar = $profile_pic->profile_pic;
        //         }

        //         $data[] = (object) [
        //             "id" => $value->id,
        //             "name" => $value->name,
        //             "email" => $value->email,
        //             "profile_pic" => $avatar,
        //         ];
        //     }

        //     $dataPageConversation[$key]->senders->data = [];
        // }

        return $this->success(["data" => $dataPageConversation], trans('lang::messages.common.getListSuccess'));
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
    public function getPageConversationSendMessageFacebook(Request $request)
    {
        $mess = FacebookService::pageConversationSendMessage($request->all());

        return $this->success(["data" => $mess], trans('lang::messages.common.getListSuccess'));
    }

    public function test()
    {

        try {
            broadcast(new FacebookReceiveMessage([
                'id' => '1',
                'status' => 'OKE',
            ]));

            // \Illuminate\Support\Facades\Redis::publish('test', json_encode(
            //     [
            //         'event' => 'test',
            //         'data' => [
            //             'camera_id' => 'test',
            //         ],
            //     ]
            // ));

            \Log::info('Facebook ' . '1' . ' update status successfully');
        } catch (\Exception $e) {
            \Log::error('Facebook ' . '1' . ' update status fail');
            \Log::error($e);
        }

        return $this->success([], trans('lang::messages.common.getListSuccess'));

    }

}
