<?php

namespace GGPHP\Crm\Province\Repositories\Eloquent;

use GGPHP\Crm\Province\Models\District;
use GGPHP\Crm\Province\Presenters\DistrictPresenter;
use GGPHP\Crm\Province\Repositories\Contracts\DistrictRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;


/**
 * Class DistrictRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DistrictRepositoryEloquent extends BaseRepository implements DistrictRepository
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
        return District::class;
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
        return DistrictPresenter::class;
    }

    public function getDistrict(array $attributes)
    {

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['city_province_id'])) {
            $this->model = $this->model->where('city_province_id', $attributes['city_province_id']);
        }

        if (!empty($attributes['limit'])) {
            $district = $this->paginate($attributes['limit']);
        } else {
            $district = $this->get();
        }

        return $district;
    }
}
