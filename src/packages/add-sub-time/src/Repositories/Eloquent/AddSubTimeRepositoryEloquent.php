<?php

namespace GGPHP\AddSubTime\Repositories\Eloquent;

use GGPHP\AddSubTime\Models\AddSubTime;
use GGPHP\AddSubTime\Presenters\AddSubTimePresenter;
use GGPHP\AddSubTime\Repositories\Contracts\AddSubTimeRepository;
use GGPHP\AddSubTime\Services\AddSubTimeServices;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AddSubTimeRepositoryEloquent.
 *
 * @package namespace GGPHP\AddSubTime\Repositories\Eloquent;
 */
class AddSubTimeRepositoryEloquent extends CoreRepositoryEloquent implements AddSubTimeRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'EmployeeId',
        'Employee.FullName' => 'like',
        'Type',
        'CreationTime',
    ];

    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AddSubTime::class;
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
        return AddSubTimePresenter::class;
    }

    /**
     * @param $attributes
     */
    public function createAddSubTime($attributes)
    {
        \DB::beginTransaction();
        try {
            $addSubTime = $this->model()::create($attributes);
            AddSubTimeServices::add($addSubTime->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return $this->find($addSubTime->Id);
    }

    public function filterAdditionalByMonth($attributes)
    {
        $this->model = $this->model->query();

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['startTime']) && !empty($attributes['endTime'])) {
            $this->model = $this->model->whereHas('addSubTimeDetail', function ($queryDetail) use ($attributes) {
                $queryDetail->whereDate('StartDate', '>=', $attributes['startTime'])->whereDate('EndDate', '<=', $attributes['endTime']);

                if (!empty($attributes['employeeId'])) {
                    $employeeId = explode(',', $attributes['employeeId']);
                    $queryDetail->whereIn('EmployeeId', $employeeId);
                }
            });
        }

        if (!empty($attributes['limit'])) {
            $additionals = $this->paginate($attributes['limit']);
        } else {
            $additionals = $this->get();
        }

        return $additionals;
    }

    public function generalAddSubTime($attributes)
    {
        $employees = $this->employeeRepositoryEloquent->model->query();

        $employees->whereHas('addSubTime', function ($query) use ($attributes) {
            if (!empty($attributes['startTime']) && !empty($attributes['endTime'])) {
                $query->whereHas('addSubTimeDetail', function ($q) use ($attributes) {
                    $q->whereDate('StartDate', '>=', $attributes['startTime'])->whereDate('EndDate', '<=', $attributes['endTime']);
                });
            }
        });

        $employees->with(['addSubTime' => function ($query) use ($attributes) {
            if (!empty($attributes['startTime']) && !empty($attributes['endTime'])) {
                $query->whereHas('addSubTimeDetail', function ($q) use ($attributes) {
                    $q->whereDate('StartDate', '>=', $attributes['startTime'])->whereDate('EndDate', '<=', $attributes['endTime']);
                });
            }
        }]);

        if (!empty($attributes['limit'])) {
            $employees = $employees->paginate($attributes['limit']);
        } else {
            $employees = $employees->get();
        }

        return $this->employeeRepositoryEloquent->parserResult($employees);
    }
}
