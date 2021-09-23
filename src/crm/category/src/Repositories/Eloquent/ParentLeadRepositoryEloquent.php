<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\ParentLead;
use GGPHP\Crm\Category\Presenters\ParentLeadPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\ParentLeadRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ParentLeadRepositoryEloquent extends BaseRepository implements ParentLeadRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ParentLead::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ParentLeadPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $parentLead = $this->paginate($attributes['limit']);
        } else {
            $parentLead = $this->get();
        }

        return $parentLead;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $code = ParentLead::max('code');

            if (is_null($code)) {
                $attributes['code'] = "TTL" . "1";
            } else {
                $getNumber = substr($code, 3) + 1;
                $attributes['code'] = "TTL" . "$getNumber";
            }
            $parentLead = ParentLead::create($attributes);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::parserResult($parentLead);
    }
}
