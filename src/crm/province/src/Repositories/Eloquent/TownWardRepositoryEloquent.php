<?php

namespace GGPHP\Crm\Province\Repositories\Eloquent;

use GGPHP\Crm\Province\Models\TownWard;
use GGPHP\Crm\Province\Presenters\TownWardPresenter;
use GGPHP\Crm\Province\Repositories\Contracts\TownWardRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;


/**
 * Class TownWardRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TownWardRepositoryEloquent extends BaseRepository implements TownWardRepository
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
        return TownWard::class;
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
        return TownWardPresenter::class;
    }

    public function getTownWard(array $attributes)
    {

        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'ilike', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['district_id'])) {
            $this->model = $this->model->where('district_id', $attributes['district_id']);
        }

        if (!empty($attributes['limit'])) {
            $townWard = $this->paginate($attributes['limit']);
        } else {
            $townWard = $this->get();
        }

        return $townWard;
    }
}
