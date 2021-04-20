<?php

namespace GGPHP\WorkHour\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\WorkHour\Models\WorkHour;
use GGPHP\WorkHour\Presenters\WorkHourPresenter;
use GGPHP\WorkHour\Repositories\Contracts\WorkHourRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class WorkHourRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class WorkHourRepositoryEloquent extends CoreRepositoryEloquent implements WorkHourRepository
{
    protected $fieldSearchable = [
        'Id',
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

        if (!empty($attributes['startDate']) && !empty($attributes['startDate'])) {
            $this->model = $this->model->where('date', '>=', $attributes['startDate'])->where('date', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
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
        $attributes['Hours'] = json_encode($attributes['Hours']);

        $workHour = WorkHour::create($attributes);

        return parent::find($workHour->Id);
    }

    public function update(array $attributes, $id)
    {
        $workHour = WorkHour::findOrFail($id);

        $attributes['Hours'] = json_encode($attributes['Hours']);
        $workHour->update($attributes);

        return parent::find($workHour->Id);
    }

}
