<?php

namespace GGPHP\Crm\Clover\Repositories\Eloquent;

use GGPHP\Crm\Clover\Models\EmployeeHrm;
use GGPHP\Crm\Clover\Presenters\EmployeeHrmPresenter;
use GGPHP\Crm\Clover\Repositories\Contracts\EmployeeHrmRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EmployeeHrmRepositoryEloquent extends BaseRepository implements EmployeeHrmRepository
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
        return EmployeeHrm::class;
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
        return EmployeeHrmPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $employeeHrm = $this->paginate($attributes['limit']);
        } else {
            $employeeHrm = $this->get();
        }

        return $employeeHrm;
    }
}
