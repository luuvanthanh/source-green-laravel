<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Message;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Presenters\PagePresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;
use Illuminate\Support\Str;
use Webpatser\Uuid\Uuid;

/**
 * Class PageRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class PageRepositoryEloquent extends BaseRepository implements PageRepository
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
        return Page::class;
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
        return PagePresenter::class;
    }

    public function pageSendMessage($attributes)
    {
        $message = FacebookService::pageConversationSendMessage($attributes);

        return $message;
    }
}
