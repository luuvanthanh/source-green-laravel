<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\ParentPotential;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Category\Presenters\ParentPotentialPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\ParentPotentialRepository;

/**
 * Class ParentPotentialRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ParentPotentialRepositoryEloquent extends BaseRepository implements ParentPotentialRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ParentPotential::class;
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
        return ParentPotentialPresenter::class;
    }

    public function getParentPotential(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $parentPotential = $this->paginate($attributes['limit']);
        } else {
            $parentPotential = $this->get();
        }

        return $parentPotential;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = ParentPotential::max('code');

            if (is_null($code)) {
                $attributes['code'] = ParentPotential::CODE . "1";
            } else {
                $stt = substr($code, 3) + 1;
                $attributes['code'] = ParentPotential::CODE . "$stt";
            }

            $parentPotential = ParentPotential::create($attributes);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::parserResult($parentPotential);
    }
}
