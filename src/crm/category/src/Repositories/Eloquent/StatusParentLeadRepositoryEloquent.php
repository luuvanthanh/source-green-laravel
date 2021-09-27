<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\StatusParentLead;
use GGPHP\Crm\Category\Presenters\StatusParentLeadPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentLeadRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StatusParentLeadRepositoryEloquent extends BaseRepository implements StatusParentLeadRepository
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
        return StatusParentLead::class;
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
        return StatusParentLeadPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $statusParentLead = $this->paginate($attributes['limit']);
        } else {
            $statusParentLead = $this->get();
        }

        return $statusParentLead;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $code = StatusParentLead::max('code');

            if (is_null($code)) {
                $attributes['code'] = StatusParentLead::CODE . "1";
            } else {
                $getNumber = substr($code, 3) + 1;
                $attributes['code'] = StatusParentLead::CODE . "$getNumber";
            }
            $parentLead = StatusParentLead::create($attributes);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($parentLead);
    }
}
