<?php

namespace GGPHP\TeacherTimekeeping\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;
use GGPHP\TeacherTimekeeping\Presenters\TeacherTimekeepingPresenter;
use GGPHP\TeacherTimekeeping\Repositories\Contracts\TeacherTimekeepingRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TeacherTimekeepingRepositoryEloquent extends CoreRepositoryEloquent implements TeacherTimekeepingRepository
{
    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        ExcelExporterServices $excelExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TeacherTimekeeping::class;
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
        return TeacherTimekeepingPresenter::class;
    }

    /**
     * getAll
     *
     * @param  mixed $attribute
     * @return void
     */
    public function getAll(array $attribute)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('teacherTimekeeping', function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            };
        })->with(['teacherTimekeeping' => function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            };
        }]);

        if (!empty($attribute['fullName'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereLike('FullName', $attribute['fullName']);
        }

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->status(User::STATUS['WORKING']);

        if (!empty($attribute['employeeId'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('teacherTimekeeping', function ($query) use ($attribute) {
                $query->whereIn('EmployeeId', explode(',', $attribute['employeeId']));
            });
        }

        if (!empty($attribute['limit'])) {
            $teacherTimekeeping = $this->employeeRepositoryEloquent->paginate($attribute['limit']);
        } else {
            $teacherTimekeeping = $this->employeeRepositoryEloquent->get();
        }

        return $teacherTimekeeping;
    }
}
