<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Events\FacebookMessageReceive;
use GGPHP\Crm\Facebook\Events\FacebookSynchronizeConversation;
use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Message;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Presenters\MessagePresenter;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PageRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class MessageRepositoryEloquent extends BaseRepository implements MessageRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Message::class;
    }



    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return MessagePresenter::class;
    }

    public function listMessage($attributes)
    {
        if (!empty($attributes['conversation_id'])) {
            $this->model = $this->model->where('conversation_id', $attributes['conversation_id']);
        }

        if (!empty($attributes['limit'])) {
            $message = $this->paginate($attributes['limit']);
        } else {
            $message = $this->get();
        }

        return $message;
    }

    public function checkCutomerConversationMessage($attributes)
    {
        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        if (is_null($page)) {
            $userId = $attributes['from'];
        } else {
            $userId = $attributes['to'];
        }
        $userFacebookInfo = UserFacebookInfo::where('user_id', $userId)->first();
        \Log::info($userFacebookInfo);
        if (!is_null($userFacebookInfo)) {
            $conversation = Conversation::where('user_facebook_info_id', $userFacebookInfo->id)->first();
        } else {
            $conversation = null;
        }
        if (is_null($conversation)) {
            $this->storeConversationMessageNew($attributes);
        } else {
            $this->storeMessage($attributes);
        }
    }

    public function storeMessage($attributes)
    {
        $page = Page::where('page_id_facebook', $attributes['from'])->first();

        if (!is_null($page)) {
            $from = $page->id;
            $pageId = $page->id;
        } else {
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['from'])->first();
            $from = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
        }
        $page = Page::where('page_id_facebook', $attributes['to'])->first();
        if (!is_null($page)) {
            $to =  $page->id;
            $pageId = $page->id;
        } else {
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['to'])->first();
            $to = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
        }

        $conversation = Conversation::where('page_id', $pageId)->where('user_facebook_info_id', $userFacebookInfoId)->first();
        $dataMessage = [
            'content' => $attributes['content'],
            'message_id_facebook' => $attributes['message_id_facebook'],
            'from' => $from,
            'to' => $to,
            'conversation_id' => $conversation->id
        ];

        $message = Message::create($dataMessage);

        $created_at = $message->created_at;
        $dataConversation = [
            'time' => $created_at->setTimezone('GMT+7')->format('H:i'),
            'snippet' => $message->content
        ];

        $conversation->update($dataConversation);
        \Log::info("khach hang cu");
        broadcast(new FacebookMessageReceive([
            'from' => $message->from,
            'to' => $message->to,
            'content' => $message->content,
        ]));
    }

    public function storeConversationMessageNew($attributes)
    {
        $page = Page::where('page_id_facebook', $attributes['from'])->first();

        if (!is_null($page)) {
            $userId = $attributes['to'];
            $pageId = $page->id;
        } else {
            $userId = $attributes['from'];
            $page = Page::where('page_id_facebook', $attributes['to'])->first();
            $pageId = $page->id;
        }
        $userFacebookInfo = UserFacebookInfo::where('user_id', $userId)->first();
        if (is_null($userFacebookInfo)) {
            $userFacebookInfo = UserFacebookInfo::create(['user_id' => $userId]);
        }
        $dataConversation = [
            'page_id' => $pageId,
            'user_facebook_info_id' => $userFacebookInfo->id
        ];
        $conversation = Conversation::create($dataConversation);
        $dataMessage = [
            'content' => $attributes['content'],
            'message_id_facebook' => $attributes['message_id_facebook'],
            'from' => $userFacebookInfo->id,
            'to' => $page->id,
            'conversation_id' => $conversation->id
        ];

        $message = Message::create($dataMessage);

        $created_at = $message->created_at;
        $dataConversation = [
            'time' => $created_at->setTimezone('GMT+7')->format('H:i'),
            'snippet' => $message->content
        ];

        $conversation->update($dataConversation);

        \Log::info("khach hang moi");
        broadcast(new FacebookSynchronizeConversation([
            'synchronizeConversation' => 'SynchronizeConversation'
        ]));

        broadcast(new FacebookMessageReceive([
            'from' => $message->from,
            'to' => $message->to,
            'content' => $message->content,
        ]));
    }
}
