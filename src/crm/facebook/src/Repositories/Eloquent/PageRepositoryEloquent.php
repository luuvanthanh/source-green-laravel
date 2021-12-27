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

    public function getPage($attributes)
    {
        if (!empty($attributes['page_id_facebook'])) {
            $pageIdFacebook = explode(',', $attributes['page_id_facebook']);
            $this->model = $this->model->whereIn('page_id_facebook', $pageIdFacebook);
        }

        if (!empty($attributes['limit'])) {
            $page = $this->paginate($attributes['limit']);
        } else {
            $page = $this->get();
        }

        return $page;
    }

    public function pageSendMessage($attributes)
    {
        $paths = null;
        if (!empty($attributes['urls'])) {
            $paths = json_decode($attributes['urls']);
        }
        if (!empty($paths)) {
            foreach ($paths as $path) {
                $urls[] = env('IMAGE_URL') . $path;
            }
            $type = 'file';
            foreach ($urls as $url) {
                if (pathinfo($url, PATHINFO_EXTENSION) == 'jpg' || pathinfo($url, PATHINFO_EXTENSION) == 'png' || pathinfo($url, PATHINFO_EXTENSION) == 'jpeg') {
                    $type = 'image';
                    break;
                } elseif (pathinfo($url, PATHINFO_EXTENSION) == 'mp4') {
                    $type = 'video';
                    break;
                }
            }
            $attributes['urls'] = $urls;
            $attributes['type'] = $type;
        }

        $message = FacebookService::pageConversationSendMessage($attributes);

        return $message;
    }
}
