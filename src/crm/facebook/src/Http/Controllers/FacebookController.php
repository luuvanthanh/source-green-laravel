<?php

namespace GGPHP\Crm\Facebook\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Facebook\Events\FacebookReceiveMessage;
use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use Illuminate\Http\Request;

class FacebookController extends Controller
{

    /**
     * @var $employeeRepository
     */
    protected $messageRepository;
    protected $articleRepository;
    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(MessageRepository $messageRepository, ArticleRepository $articleRepository)
    {
        $this->messageRepository = $messageRepository;
        $this->articleRepository = $articleRepository;
    }

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
                        //\Log::info('send');
                        broadcast(new FacebookReceiveMessage([
                            'sender' => $messaging['sender']['id'],
                            'recipient' => $messaging['recipient']['id'],
                            'message' => $text,
                        ]));
                    }

                    $messageId = null;
                    if (isset($messaging['message']) && isset($messaging['message']['mid'])) {
                        $messageId = $messaging['message']['mid'];
                    }

                    if (isset($messaging['message']) && !is_null($text) && !is_null($messageId)) {
                        $attributes = [
                            'from' => $messaging['sender']['id'],
                            'to' => $messaging['recipient']['id'],
                            'content' => $text,
                            'message_id_facebook' => $messageId
                        ];
                        $this->messageRepository->checkCutomerConversationMessage($attributes);
                    }
                }
                if (isset($entry['changes'])) {
                    $changes = $entry['changes'][0];

                    if (isset($changes['value']['post_id'])) {
                        if ($changes['value']['item'] == "video") {
                            $postFacebookInfo = PostFacebookInfo::where('video_id', $changes['value']['video_id'])->first();
                            $postFacebookInfo->facebook_post_id = $changes['value']['post_id'];
                            $postFacebookInfo->update();
                        }
                    }
                    $this->articleRepository->postFacebookInfo($changes);
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
        try {
            $pages = FacebookService::listPages($request->all());

            return $this->success(["data" => $pages], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageTokenFacebook(Request $request)
    {
        try {
            $pageToken = FacebookService::pageToken($request->all());

            return $this->success(["data" => $pageToken], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageConversationFacebook(Request $request)
    {
        try {
            $pageConversation = FacebookService::pageConversation($request->all());

            return $this->success(["data" => $pageConversation], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getPageConversationMessageFacebook(Request $request)
    {
        try {
            $pageConversationMessage = FacebookService::pageConversationMessage($request->all());

            return $this->success(["data" => $pageConversationMessage], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function pageConversationSendMessageFacebook(Request $request)
    {
        try {
            $mess = FacebookService::pageConversationSendMessage($request->all());

            return $this->success(["data" => $mess], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function publishPagePost(Request $request)
    {
        try {
            $mess = FacebookService::publishPagePost($request->all());

            return $this->success(["data" => $mess], trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }

    public function getPagePost(Request $request)
    {
        try {
            $mess = FacebookService::getPagePost($request->all());

            return $this->success((array) $mess, trans('lang::messages.common.getListSuccess'));
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }
}
