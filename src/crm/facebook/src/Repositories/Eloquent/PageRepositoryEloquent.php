<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Jobs\SendMessageFacebook;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Presenters\PagePresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

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
        if (!empty($attributes['article_id'])) {
            $this->model = $this->model->whereHas('postFacebookInfo', function ($query) use ($attributes) {
                $query->where('article_id', $attributes['article_id']);
            });
        }

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
        if (!empty($attributes['url_files'])) {
            $data_url = [];

            foreach ($attributes['url_files'] as $urlFile) {
                $type = '';
                $url =  env('IMAGE_URL') . $urlFile['url'];

                if (pathinfo($url, PATHINFO_EXTENSION) == 'mp3') {
                    $data_url[] = [
                        'type' => 'audio',
                        'url' => $url
                    ];
                } elseif (pathinfo($url, PATHINFO_EXTENSION) == 'mp4') {
                    $data_url[] = [
                        'type' => 'video',
                        'url' => $url
                    ];
                } elseif (array_search(pathinfo($url, PATHINFO_EXTENSION), Page::IMAGE) != false) {
                    $data_url[] = [
                        'type' => 'image',
                        'url' => $url
                    ];
                } else {
                    $name = str_replace(' ', '-', $urlFile['name']);
                    $contents = file_get_contents($url);
                    Storage::disk('local')->put('public/files/' . $name, $contents);
                    $url = env('URL_CRM') . '/storage/files/' . $name;
                    $data_url[] = [
                        'type' => 'file',
                        'url' => $url
                    ];
                }
            }

            $attributes['urls'] = $data_url;
            $attributes['type'] = $type;
        }

        dispatch(new SendMessageFacebook($attributes));

        return null;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['data_page'])) {
            foreach ($attributes['data_page'] as $dataPage) {
                $page = Page::where('page_id_facebook', $dataPage['page_id_facebook'])->first();
                if (is_null($page)) {
                    $page = Page::create($dataPage);
                } else {
                    $page->update($dataPage);
                }
            }
        }

        return $this->parserResult($page);
    }
}
