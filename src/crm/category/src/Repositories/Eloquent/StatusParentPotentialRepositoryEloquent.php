<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\StatusParentPotential;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Category\Presenters\StatusParentPotentialPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentPotentialRepository;

/**
 * Class StatusParentPotentialRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class StatusParentPotentialRepositoryEloquent extends BaseRepository implements StatusParentPotentialRepository
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
        return StatusParentPotential::class;
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
        return StatusParentPotentialPresenter::class;
    }

    public function getStatusParentPotential(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $statusParentPotential = $this->paginate($attributes['limit']);
        } else {
            $statusParentPotential = $this->get();
        }

        return $statusParentPotential;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = StatusParentPotential::max('code');

            if (is_null($code)) {
                $attributes['code'] = StatusParentPotential::CODE . "1";
            } else {
                $stt = substr($code, 3) + 1;
                $attributes['code'] = StatusParentPotential::CODE . "$stt";
            }

            $statusParentPotential = StatusParentPotential::create($attributes);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::parserResult($statusParentPotential);
    }
}
