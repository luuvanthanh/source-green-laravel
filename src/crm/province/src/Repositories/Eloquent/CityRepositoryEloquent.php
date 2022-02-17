<?php

namespace GGPHP\Crm\Province\Repositories\Eloquent;

use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Presenters\CityPresenter;
use GGPHP\Crm\Province\Repositories\Contracts\CityRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CityRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CityRepositoryEloquent extends BaseRepository implements CityRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
        'numerical_city'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return City::class;
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
        return CityPresenter::class;
    }

    public function getCity(array $attributes)
    {

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $city = $this->paginate($attributes['limit']);
        } else {
            $city = $this->get();
        }

        return $city;
    }

    public function sort(array $attributes)
    {
        $listId = explode(',', $attributes['id']);

        foreach ($listId as $key => $value) {
            $fisrtValue = City::find($value);
            $fisrtValue->update(['numerical_city' => $key + 1]);
        }

        $result = City::orderBy('numerical_city')->get();
        return parent::parserResult($result);
    }
}
