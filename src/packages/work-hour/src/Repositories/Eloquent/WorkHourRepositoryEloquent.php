<?php

namespace GGPHP\WorkHour\Repositories\Eloquent;

use GGPHP\WorkHour\Models\WorkHour;
use GGPHP\WorkHour\Presenters\WorkHourPresenter;
use GGPHP\WorkHour\Repositories\Contracts\WorkHourRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class WorkHourRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WorkHourRepositoryEloquent extends BaseRepository implements WorkHourRepository
{
    protected $fieldSearchable = [
        'id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return WorkHour::class;
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
        return WorkHourPresenter::class;
    }

    public function filterWorkHour(array $attributes)
    {

        if (!empty($attributes['start_date']) && !empty($attributes['start_date'])) {
            $this->model = $this->model->where('date', '>=', $attributes['start_date'])->where('date', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $workHour = $this->paginate($attributes['limit']);
        } else {
            $workHour = $this->get();
        }

        return $workHour;
    }

    public function create(array $attributes)
    {
        $attributes['hours'] = json_encode($attributes['hours']);

        $workHour = WorkHour::create($attributes);

        return parent::find($workHour->id);
    }

    public function update(array $attributes, $id)
    {
        $workHour = WorkHour::findOrFail($id);

        $attributes['hours'] = json_encode($attributes['hours']);
        $workHour->update($attributes);

        return parent::find($workHour->id);
    }

}
