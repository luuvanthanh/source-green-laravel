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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function GuzzleHttp\json_decode;

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

    public function getConversation($attributes)
    {
        if (!empty($attributes['page_id_facebook'])) {
            $this->model = $this->model->whereHas('page', function ($query) use ($attributes) {
                $query->where('page_id_facebook', $attributes['page_id_facebook']);
            });
        }

        if (!empty($attributes['name_inbox'])) {
            $this->model = $this->model->whereHas('userFacebookInfo', function ($query) use ($attributes) {
                $query->whereLike('user_name', $attributes['name_inbox']);
            });
        }

        if (!empty($attributes['page_id'])) {
            $this->model = $this->model->where('page_id', $attributes['page_id']);
        }

        if (!empty($attributes['tag_id'])) {
            $tagId = explode(',', $attributes['tag_id']);
            $this->model = $this->model->whereHas('userFacebookInfo', function ($query) use ($tagId) {
                $query->whereHas('userFacebookInfoTag', function ($q) use ($tagId) {
                    $q->whereIn('tag_id', $tagId);
                });
            });
        }

        if (!empty($attributes['noti_inbox']) && $attributes['noti_inbox'] == 'NOT_SEEN') {
            $this->model = $this->model->where('noti_inbox', Conversation::NOTI_INBOX[$attributes['noti_inbox']]);
        }

        if (!empty($attributes['noti_inbox']) && $attributes['noti_inbox'] == 'SEEN') {
            $this->model = $this->model->where('noti_inbox', Conversation::NOTI_INBOX[$attributes['noti_inbox']]);
        }

        if (!empty($attributes['not_reply']) && $attributes['not_reply'] == 'true') {
            $this->model = $this->model->where('from', '!=', $attributes['page_id']);
        }

        if (!empty($attributes['not_phone_number']) && $attributes['not_phone_number'] == 'true') {
            $this->model = $this->model->whereDoesntHave('message', function ($query) {
                $query->where(function ($q) {
                    $q->whereLike('content', '086')->orWhereLike('content', '096')
                        ->orWhereLike('content', '097')->orWhereLike('content', '098')
                        ->orWhereLike('content', '032')->orWhereLike('content', '033')
                        ->orWhereLike('content', '034')->orWhereLike('content', '035')
                        ->orWhereLike('content', '036')->orWhereLike('content', '037')
                        ->orWhereLike('content', '038')->orWhereLike('content', '039')
                        ->orWhereLike('content', '088')->orWhereLike('content', '091')
                        ->orWhereLike('content', '088')->orWhereLike('content', '091')
                        ->orWhereLike('content', '094')->orWhereLike('content', '083')
                        ->orWhereLike('content', '084')->orWhereLike('content', '085')
                        ->orWhereLike('content', '081')->orWhereLike('content', '082')
                        ->orWhereLike('content', '089')->orWhereLike('content', '090')
                        ->orWhereLike('content', '093')->orWhereLike('content', '070')
                        ->orWhereLike('content', '079')->orWhereLike('content', '077')
                        ->orWhereLike('content', '076')->orWhereLike('content', '078')
                        ->orWhereLike('content', '092')->orWhereLike('content', '056')
                        ->orWhereLike('content', '058')->orWhereLike('content', '099')
                        ->orWhereLike('content', '059');
                });
            });
        }

        if (!empty($attributes['not_phone_number']) && $attributes['not_phone_number'] == 'false') {
            $this->model = $this->model->whereHas('message', function ($query) {
                $query->where(function ($q) {
                    $q->whereLike('content', '086')->orWhereLike('content', '096')
                        ->orWhereLike('content', '097')->orWhereLike('content', '098')
                        ->orWhereLike('content', '032')->orWhereLike('content', '033')
                        ->orWhereLike('content', '034')->orWhereLike('content', '035')
                        ->orWhereLike('content', '036')->orWhereLike('content', '037')
                        ->orWhereLike('content', '038')->orWhereLike('content', '039')
                        ->orWhereLike('content', '088')->orWhereLike('content', '091')
                        ->orWhereLike('content', '088')->orWhereLike('content', '091')
                        ->orWhereLike('content', '094')->orWhereLike('content', '083')
                        ->orWhereLike('content', '084')->orWhereLike('content', '085')
                        ->orWhereLike('content', '081')->orWhereLike('content', '082')
                        ->orWhereLike('content', '089')->orWhereLike('content', '090')
                        ->orWhereLike('content', '093')->orWhereLike('content', '070')
                        ->orWhereLike('content', '079')->orWhereLike('content', '077')
                        ->orWhereLike('content', '076')->orWhereLike('content', '078')
                        ->orWhereLike('content', '092')->orWhereLike('content', '056')
                        ->orWhereLike('content', '058')->orWhereLike('content', '099')
                        ->orWhereLike('content', '059');
                });
            });
        }

        if (!empty($attributes['employee_facebook_id'])) {
            $employeeFacebookId = explode(',', $attributes['employee_facebook_id']);
            $this->model = $this->model->whereHas('userFacebookInfo', function ($query) use ($employeeFacebookId) {
                $query->whereIn('employee_facebook_id', $employeeFacebookId);
            });
        }

        if (!empty($attributes['conversation_id'])) {
            $conversationId = explode(',', $attributes['conversation_id']);
            $this->model = $this->model->whereIn('id', $conversationId);
        }

        if (!empty($attributes['show_conversation']) && $attributes['show_conversation'] == 'true') {
            $this->model = $this->model->where('show_conversation', true);
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
        if (!empty($attributes['data_page'])) {
            foreach ($attributes['data_page'] as $attributes) {
                $conversations = FacebookService::pageConversation($attributes);
                foreach ($conversations as $conversation) {
                    $conversationId = $conversation->id;
                    foreach ($conversation->senders as $value) {
                        $attributes['user_id'] = $value[0]->id;
                        $url = FacebookService::getAvatarUser($attributes);
                        $avatar = $this->storeAvatarUser($url, $value[0]->id);
                        $dataUserFacebookInfo = [
                            'user_id' => $value[0]->id,
                            'user_name' => $value[0]->name,
                            'avatar' => $avatar
                        ];
                        $dataPage = [
                            'page_id_facebook' => $value[1]->id,
                            'name' => $value[1]->name,
                        ];
                        $userFacebookInfo = UserFacebookInfo::Where('user_id', $dataUserFacebookInfo['user_id'])->first();

                        if (is_null($userFacebookInfo)) {
                            $userFacebookInfo = UserFacebookInfo::create($dataUserFacebookInfo);
                        } else {
                            $userFacebookInfo->update(['user_name' => $dataUserFacebookInfo['user_name']]);
                            $userFacebookInfo->update(['avatar' => $dataUserFacebookInfo['avatar']]);
                        }

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
            }
        }

        return parent::parserResult($conversation);
    }

    public function seenConversation($attributes)
    {
        $conversation = Conversation::find($attributes['conversation_id']);
        $conversation->update(['noti_inbox' => Conversation::NOTI_INBOX[$attributes['noti_inbox']]]);
        return $conversation;
    }

    public function storeAvatarUser($url, $userId)
    {
        $contents = file_get_contents($url);
        $name = $userId . '.jpg';
        Storage::disk('local')->put('public/files/' . $name, $contents);
        $url = env('URL_CRM') . '/storage/files/' . $name;

        return $url;
    }
}
