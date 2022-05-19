<?php

namespace GGPHP\TeacherAssignment\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\TeacherAssignment\Models\TeacherAssignment;
use GGPHP\TeacherAssignment\Presenters\TeacherAssignmentPresenter;
use GGPHP\TeacherAssignment\Repositories\Contracts\TeacherAssignmentRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AppointRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TeacherAssignmentRepositoryEloquent extends CoreRepositoryEloquent implements TeacherAssignmentRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TeacherAssignment::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TeacherAssignmentPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('DecisionDate', '>=', $attributes['startDate'])->whereDate('DecisionDate', '<=', $attributes['endDate']);
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

        if (!empty($attributes['limit'])) {
            $teacherAssignment = $this->paginate($attributes['limit']);
        } else {
            $teacherAssignment = $this->get();
        }

        return $teacherAssignment;
    }
}
