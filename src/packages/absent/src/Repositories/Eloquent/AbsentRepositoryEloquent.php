<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Presenters\AbsentPresenter;
use GGPHP\Absent\Repositories\Absent\AbsentRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends BaseRepository implements AbsentRepository
{
    protected $employeeRepositoryEloquent, $excelExporterServices;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'store_id',
        'status',
        'absent_type_id',
        'absent_reason_id',
        'employee.full_name' => 'like',
        'sabbaticalLeave',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Absent::class;
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
        return AbsentPresenter::class;
    }

    /**
     * FilterAbsent
     * @param $attributes
     * @return mixed
     */
    public function filterAbsent($attributes, $parse = true)
    {
        if (!empty($attributes['absent_type_id'])) {
            $this->model = $this->model->where('absent_type_id', $attributes['absent_type_id']);
        }

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                    ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                    ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
            });
        }

        if (!empty($attributes['limit'])) {
            $absents = $this->paginate($attributes['limit']);
        } else {
            $absents = $this->get();
        }

        return $absents;
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getAbsent($attributes, $parse = true)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->query();

        if (!empty($attributes['is_absent'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('absent', function ($query) use ($attributes) {
                if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                    $query->whereDate('start_date', '>=', $attributes['start_date'])->whereDate('start_date', '<=', $attributes['end_date']);
                }

                if (!empty($attributes['absent_type_id'])) {
                    $query->where('absent_type_id', $attributes['absent_type_id']);
                }

                $query->whereNotIn('absent_type_id', [1, 3, 5, 6, 7]);

                $query->approved();

            });
        }

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $query->whereDate('start_date', '>=', $attributes['start_date'])->whereDate('start_date', '<=', $attributes['end_date']);
            }

            if (!empty($attributes['absent_type_id'])) {
                $query->where('absent_type_id', $attributes['absent_type_id']);
            }

        }]);

        if (!empty($attributes['employee_id'])) {
            $this->employeeRepositoryEloquent->model->whereIn('id', explode(',', $attributes['employee_id']));
        }

        if (!empty($attributes['limit'])) {
            $employees = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $employees = $this->employeeRepositoryEloquent->get();
        }

        return $employees;
    }
}
