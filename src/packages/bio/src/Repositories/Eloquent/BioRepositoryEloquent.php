<?php

namespace GGPHP\Bio\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Bio\Models\Bio;
use GGPHP\Bio\Presenters\BioPresenter;
use GGPHP\Bio\Repositories\Contracts\BioRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class BioRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class BioRepositoryEloquent extends CoreRepositoryEloquent implements BioRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Bio::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return BioPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all Magnetic Card
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAll(array $attributes)
    {

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->where('EmployeeId', $employeeId);
        }

        $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        $this->model = $this->model->withTrashed();

        if (!empty($attributes['limit'])) {
            $bio = $this->paginate($attributes['limit']);
        } else {
            $bio = $this->get();
        }

        return $bio;
    }
}
