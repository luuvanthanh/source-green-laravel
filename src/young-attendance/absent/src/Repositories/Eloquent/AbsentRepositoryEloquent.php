<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentPresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends CoreRepositoryEloquent implements AbsentRepository
{
    protected $studentRepositoryEloquent;

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'AbsentTypeId',
        'AbsentReasonId',
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

        if (!empty($attributes['parentId'])) {
            $parentId = explode(',', $attributes['parentId']);
            $this->model = $this->model->whereIn('ParentId', $parentId);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->model = $this->model->whereIn('StudentId', $studentId);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->where('status', $attributes['status']);
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
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->query();

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('StartDate', '>=', $attributes['startDate'])->whereDate('StartDate', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['absentTypeId'])) {
                $query->where('AbsentTypeId', $attributes['absentTypeId']);
            }

        }]);

        if (!empty($attributes['parentId'])) {
            $this->studentRepositoryEloquent->model->whereIn('Id', explode(',', $attributes['parentId']));
        }

        if (!empty($attributes['limit'])) {
            $parents = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $parents = $this->studentRepositoryEloquent->get();
        }

        return $parents;
    }

    public function create(array $attributes)
    {
        $absent = Absent::create($attributes);

        if ($absent->Status == 'CONFIRM') {
            $begin = new \DateTime($startDate);
            $end = new \DateTime($endDate);
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            foreach ($periodDate as $date) {
                $attendance = Attendance::where('StudentId', $attributes['studentId'])->where('Date', $date->format('Y-m-d'))->first();
                if (is_null($attendance)) {
                    $attendance = Attendance::create([
                        'StudentId' => $attributes['studentId'],
                        'Date' => $date->format('Y-m-d'),
                        'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                    ]);
                } else {
                    $attendance->update([
                        'StudentId' => $attributes['studentId'],
                        'Date' => $date->format('Y-m-d'),
                        'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                    ]);
                }

            }
        } else {

            $urlNoti = env('NOTI_URL') . '/api/notification';

            $parentId = $absent->student->parent->pluck('Id')->toArray();
            $nameStudent = $absent->student->FullName;
            $imageUrl = $absent->student->FileImage;
            $startDate = $absent->StartDate->format('d-m');
            $endDate = $absent->EndDate->format('d-m');
            if (!empty($parentId)) {
                Http::post("$urlNoti", [
                    'users' => $parentId,
                    'title' => 'Clover',
                    'imageURL' => $imageUrl,
                    'message' => "Đơn xin phép nghỉ được tạo từ ngày $startDate đến ngày $endDate cần Phụ huynh duyệt đơn.",
                ]);
            }
        }

        return parent::find($absent->id);
    }

    public function update(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        $absent->update($attributes);

        if ($attributes['status'] == 'CONFIRM') {
            $begin = new \DateTime($startDate);
            $end = new \DateTime($endDate);
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            foreach ($periodDate as $date) {
                $attendance = Attendance::where('StudentId', $attributes['studentId'])->where('Date', $date->format('Y-m-d'))->first();
                if (is_null($attendance)) {
                    $attendance = Attendance::create([
                        'StudentId' => $attributes['studentId'],
                        'Date' => $date->format('Y-m-d'),
                        'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                    ]);
                } else {
                    $attendance->update([
                        'StudentId' => $attributes['studentId'],
                        'Date' => $date->format('Y-m-d'),
                        'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                    ]);
                }
            }
        }

        return parent::find($id);
    }
}
