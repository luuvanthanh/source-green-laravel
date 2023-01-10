<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Models\PhysicalStudyProgramSession;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\StudyProgram\AttendancePhysical\Models\AttendancePhysical;
use GGPHP\StudyProgram\AttendancePhysical\Presenters\AttendancePhysicalPresenter;
use GGPHP\StudyProgram\AttendancePhysical\Repositories\Contracts\AttendancePhysicalRepository;
use Illuminate\Container\Container;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AttendancePhysicalRepositoryEloquent extends BaseRepository implements AttendancePhysicalRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    protected $studentRepositoryEloquent;

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Container $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AttendancePhysical::class;
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
        return AttendancePhysicalPresenter::class;
    }

    public function getAll(array $attributes)
    {
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', Student::OFFICAL);

        $now = Carbon::now();

        if (!empty($attributes['status']) && $attributes['status'] == AttendancePhysical::STATUS['HAVE_OUT_CLASS']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('attendance', function ($query) use ($attributes, $now) {
                $query->where('Date', $now->format('Y-m-d'))->where('Status', Attendance::STATUS['HAVE_IN']);
            })->doesntHave('attendancePhysical');
        } elseif (!empty($attributes['status']) && $attributes['status'] == AttendancePhysical::STATUS['HAVE_IN_CLASS']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('attendancePhysical', function ($query) use ($attributes, $now) {
                $query->whereDate('DateHaveInClass', $now->format('Y-m-d'));
            });

            if (!empty($attributes['physicalStudyProgramId'])) {
                $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('attendancePhysical', function ($query) use ($attributes) {
                    $query->where('PhysicalStudyProgramId', $attributes['physicalStudyProgramId']);
                });
            }

            if (!empty($attributes['physicalStudyProgramSessionId'])) {
                $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('attendancePhysical', function ($query) use ($attributes) {
                    $query->where('PhysicalStudyProgramSessionId', $attributes['physicalStudyProgramSessionId']);
                });
            }
        }

        if (!empty($attributes['classId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('ClassId', $attributes['classId']);
        }

        if (!empty($attributes['branchId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($attributes) {
                $query->whereHas('classes', function ($query2) use ($attributes) {
                    $query2->whereIn('BranchId', $attributes['branchId']);
                });
            });
        }

        if (!empty($attributes['limit'])) {
            $student = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $student = $this->studentRepositoryEloquent->paginate(50);
        }

        return $student;
    }

    public function createAttendancePhysical($attributes)
    {
        foreach ($attributes['studentId'] as $value) {
            $attributes['studentId'] = $value;
            $attributes['dateHaveInClass'] = Carbon::now()->format('Y-m-d H:i:s');
            $attendancePhysical = AttendancePhysical::create($attributes);

            //$this->created($attributes);
        }

        return $this->parserResult($attendancePhysical);
    }

    public function created($attributes)
    {
        $physicalStudyProgramSession = PhysicalStudyProgramSession::findOrFail($attributes['physicalStudyProgramSessionId']);

        if ($physicalStudyProgramSession->IsUsed != true) {
            $physicalStudyProgramSession->update(['IsUsed' => true]);
        }
    }
}
