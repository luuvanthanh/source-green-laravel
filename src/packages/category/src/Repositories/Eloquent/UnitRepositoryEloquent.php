<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Unit;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\UnitPresenter;
use GGPHP\Category\Repositories\Contracts\UnitRepository;

/**
 * Class UnitRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class UnitRepositoryEloquent extends BaseRepository implements UnitRepository
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
        return Unit::class;
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
        return UnitPresenter::class;
    }

    public function getUnit(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $unit = $this->paginate($attributes['limit']);
        } else {
            $unit = $this->get();
        }

        return $unit;
    }
}
