<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Message;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Presenters\ConversationPresenter;
use GGPHP\Crm\Facebook\Presenters\MessagePresenter;
use GGPHP\Crm\Facebook\Repositories\Contracts\ConversationRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PageRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ConversationRepositoryEloquent extends BaseRepository implements ConversationRepository
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
        return Conversation::class;
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
        return ConversationPresenter::class;
    }

    public function listConversation($attributes)
    {
        if (!empty($attributes['page_id'])) {
            $this->model = $this->model->whereHas('page', function ($query) use ($attributes) {
                $query->where('page_id_facebook', $attributes['page_id']);
            });
        }

        if (!empty($attributes['limit'])) {
            $conversation = $this->paginate($attributes['limit']);
        } else {
            $conversation = $this->get();
        }

        return $conversation;
    }

    public function synchronizeConversation($attributes)
    {
        $conversations = FacebookService::pageConversation($attributes);

        foreach ($conversations as $conversation) {
            $conversationId = $conversation->id;

            foreach ($conversation->senders as $value) {
                $dataUserFacebookInfo = [
                    'user_id' => $value[0]->id,
                    'user_name' => $value[0]->name,
                ];
                $dataPage = [
                    'page_id_facebook' => $value[1]->id,
                    'name' => $value[1]->name,
                ];
                $userFacebookInfo = UserFacebookInfo::Where('user_id', $dataUserFacebookInfo['user_id'])->first();

                if (is_null($userFacebookInfo)) {
                    $userFacebookInfo = UserFacebookInfo::create($dataUserFacebookInfo);
                }

                $userFacebookInfo->update(['user_name' => $dataUserFacebookInfo['user_name']]);

                $page = Page::Where('page_id_facebook', $dataPage['page_id_facebook'])->first();

                if (is_null($page)) {
                    $page = Page::create($dataPage);
                }

                $conversation = Conversation::Where('page_id', $page->id)->Where('user_facebook_info_id', $userFacebookInfo->id)->first();

                $dataConversation = [
                    'page_id' => $page->id,
                    'user_facebook_info_id' => $userFacebookInfo->id,
                    'conversation_id_facebook' => $conversationId
                ];
                if (is_null($conversation)) {
                    $conversation = Conversation::create($dataConversation);
                }

                $conversation->update(['conversation_id_facebook' => $dataConversation['conversation_id_facebook']]);
            }
        }

        return $conversation;
    }
}
