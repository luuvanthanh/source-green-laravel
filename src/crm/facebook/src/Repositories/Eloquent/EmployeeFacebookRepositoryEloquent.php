<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use GGPHP\Crm\Facebook\Models\EmployeeFacebook;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Presenters\EmployeeFacebookPresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Facebook\Repositories\Contracts\EmployeeFacebookRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;

/**
 * Class EmployeeFacebookRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class EmployeeFacebookRepositoryEloquent extends BaseRepository implements EmployeeFacebookRepository
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
        return EmployeeFacebook::class;
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
        return EmployeeFacebookPresenter::class;
    }

    public function getEmployeeFacebook($attributes)
    {
        if (!empty($attributes['page_id'])) {
            $this->model = $this->model->where('page_id', $attributes['page_id']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('employee_fb_name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $page = $this->paginate($attributes['limit']);
        } else {
            $page = $this->get();
        }

        return $page;
    }

    public function create(array $attributes)
    {
        $pageRole = FacebookService::pageRole($attributes);
        $page = Page::where('page_id_facebook', $attributes['page_id'])->first();
        foreach ($pageRole as $key => $value) {
            $attributes['user_id'] = $value->id;
            $avatar = FacebookService::getAvatarUser($attributes);
            $data = [
                'employee_fb_name' => $value->name,
                'employee_fb_id' => $value->id,
                'page_id' => $page->id,
                'avatar' => $avatar
            ];

            $employeeFacebook = EmployeeFacebook::where('employee_fb_id', $value->id)->first();

            if (is_null($employeeFacebook)) {
                $employeeFacebook = EmployeeFacebook::create($data);
            } else {
                $employeeFacebook->update(['employee_fb_name' => $data['employee_fb_name']]);
                $employeeFacebook->update(['avatar' => $data['avatar']]);
            }
        }

        return parent::all();
    }

    public function destroyAllEmployeeFacebook()
    {
        $employeeFacebook = EmployeeFacebook::query()->delete();
        return $employeeFacebook;
    }
}
