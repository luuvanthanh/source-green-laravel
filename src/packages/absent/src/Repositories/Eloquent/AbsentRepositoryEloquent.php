<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Presenters\AbsentPresenter;
use GGPHP\Absent\Repositories\Absent\AbsentRepository;
use GGPHP\Absent\Services\AbsentDetailServices;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends CoreRepositoryEloquent implements AbsentRepository
{
    protected $employeeRepositoryEloquent;
    protected $excelExporterServices;
    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'AbsentTypeId',
        'AbsentReasonId',
        'Employee.FullName' => 'like',
        'CreationTime',
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
        if (!empty($attributes['absentTypeId'])) {
            $this->model = $this->model->where('AbsentTypeId', $attributes['absentTypeId']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
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
    public function getAbsent($attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->query();

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('StartDate', '>=', $attributes['startDate'])->whereDate('StartDate', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['absentTypeId'])) {
                $query->where('AbsentTypeId', $attributes['absentTypeId']);
            }
        }]);

        if (!empty($attributes['employeeId'])) {
            $this->employeeRepositoryEloquent->model->whereIn('Id', explode(',', $attributes['employeeId']));
        }

        if (!empty($attributes['limit'])) {
            $employees = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $employees = $this->employeeRepositoryEloquent->get();
        }

        return $employees;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $absent = Absent::create($attributes);

            AbsentDetailServices::add($absent->Id, $attributes['detail']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($absent->Id);
    }

    public function update(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        \DB::beginTransaction();
        try {
            $absent->update($attributes);
            $absent->absentDetail()->delete();
            AbsentDetailServices::add($id, $attributes['detail']);
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($id);
    }
}
