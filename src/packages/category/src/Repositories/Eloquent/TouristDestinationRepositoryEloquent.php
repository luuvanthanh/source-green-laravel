<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\TouristDestination;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\TouristDestinationPresenter;
use GGPHP\Category\Repositories\Contracts\TouristDestinationRepository;

/**
 * Class TouristDestinationRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class TouristDestinationRepositoryEloquent extends BaseRepository implements TouristDestinationRepository
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
        return TouristDestination::class;
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
        return TouristDestinationPresenter::class;
    }

    public function getTouristDestination(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $touristDestination = $this->paginate($attributes['limit']);
        } else {
            $touristDestination = $this->get();
        }

        return $touristDestination;
    }
}
