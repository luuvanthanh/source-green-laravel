<?php

namespace GGPHP\Attendance\Repositories\Eloquents;

use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Attendance\Presenters\AttendanceLogPresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceLogRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AttendanceLogRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AttendanceLogRepositoryEloquent extends CoreRepositoryEloquent implements AttendanceLogRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AttendanceLog::class;
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
        return AttendanceLogPresenter::class;
    }

    public function filterAttendanceLog(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('CreationTime', '>=', $attributes['startDate'])->where('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);

            if (!empty($attributes['classId'])) {
                $query->whereHas('classTeacher', function ($q) use ($attributes) {
                    $q->where('ClassId', $attributes['classId']);
                });
            }
        });

        if (!empty($attributes['limit'])) {
            $attendanceLog = $this->paginate($attributes['limit']);
        } else {
            $attendanceLog = $this->get();
        }

        return $attendanceLog;
    }
}
