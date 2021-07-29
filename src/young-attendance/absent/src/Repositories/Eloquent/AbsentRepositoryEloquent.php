<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentPresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Http;
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
            $this->model = $this->model->where('Status', $attributes['status']);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['isEmployee'])) {
            $this->model = $this->model->whereNull('ParentId');
        }

        if (!empty($attributes['isParent'])) {
            $this->model = $this->model->whereNull('EmployeeId');
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

    public function create(array $attributes)
    {

        \DB::beginTransaction();
        try {
            $absent = Absent::create($attributes);


            if ($absent->Status == 'CONFIRM') {

                $begin = new \DateTime($attributes['startDate']);
                $end = new \DateTime($attributes['endDate'] . '23:59');
                $intervalDate = new \DateInterval('P1D');
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

                $urlNoti = env('NOTI_URL') . '/api/notification';
                $teachers = $absent->student->classStudent->classes->teacher;
                $userId = [];

                if (!empty($teachers)) {
                    foreach ($teachers as $teacher) {
                        if (!is_null($teacher->account)) {
                            $userId[] = $teacher->account->AppUserId;
                        }
                    }
                }

                $nameStudent = $absent->student->FullName;
                $images =  $absent->student->FileImage;
                $urlImage = '';

                if (!is_null($images)) {
                    $images = json_decode($images);
                    $urlImage = env('IMAGE_URL') . $images[0];
                }

                $startDate = $absent->StartDate->format('d-m');
                $endDate = $absent->EndDate->format('d-m');

                if (!empty($userId)) {
                    Http::post("$urlNoti", [
                        'users' => $userId,
                        'title' => $nameStudent,
                        'imageURL' => $urlImage,
                        'message' => "Bé $nameStudent xin nghỉ phép ngày $startDate - $endDate",
                        'moduleType' => 9,
                        'refId' => $absent->Id,
                    ]);
                }
            } else {
                $urlNoti = env('NOTI_URL') . '/api/notification';
                $parents = $absent->student->parent;
                $userId = [];

                if (!empty($parents)) {
                    foreach ($parents as $parent) {
                        if (!is_null($parent->account)) {
                            $userId[] = $parent->account->AppUserId;
                        }
                    }
                }

                $nameStudent = $absent->student->FullName;
                $images =  $absent->student->FileImage;
                $urlImage = '';

                if (!is_null($images)) {
                    $images = json_decode($images);
                    $urlImage = env('IMAGE_URL') . $images[0];
                }
                $startDate = $absent->StartDate->format('d-m');
                $endDate = $absent->EndDate->format('d-m');

                if (!empty($userId)) {
                    $response = Http::post("$urlNoti", [
                        'users' => $userId,
                        'title' => $nameStudent,
                        'imageURL' => $urlImage,
                        'message' => "Đơn xin phép nghỉ từ ngày $startDate đến ngày $endDate cần Phụ huynh duyệt đơn.",
                        'moduleType' => 9,
                        'refId' => $absent->Id,
                    ]);
                }
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }



        return parent::find($absent->Id);
    }

    public function update(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        $absent->update($attributes);

        if ($absent->Status == 'CONFIRM') {
            $beginOld = new \DateTime($absent->StartDate);
            $endOld = new \DateTime($absent->EndDate);
            $intervalDateOld = \DateInterval::createFromDateString('1 day');
            $periodDateOld = new \DatePeriod($beginOld, $intervalDateOld, $endOld);

            foreach ($periodDateOld as $date) {
                Attendance::where('StudentId', $attributes['studentId'])->where('Date', $date->format('Y-m-d'))
                    ->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->delete();
            }

            $begin = new \DateTime($attributes['startDate']);
            $end = new \DateTime($attributes['endDate']);
            $intervalDate = new \DateInterval('P1D');
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

            $urlNoti = env('NOTI_URL') . '/api/notification';

            $teachers = $absent->student->classStudent->classes->teacher;
            $userId = [];

            if (!empty($teachers)) {
                foreach ($teachers as $teacher) {
                    if (!is_null($teacher->account)) {
                        $userId[] = $teacher->account->AppUserId;
                    }
                }
            }

            $nameStudent = $absent->student->FullName;
            $images =  $absent->student->FileImage;
            $urlImage = '';

            if (!is_null($images)) {
                $images = json_decode($images);
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $startDate = $absent->StartDate->format('d-m');
            $endDate = $absent->EndDate->format('d-m');

            if (!empty($userId)) {
                Http::post("$urlNoti", [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => "Bé $nameStudent xin nghỉ phép được thay đổi ngày $startDate - $endDate",
                    'moduleType' => 9,
                    'refId' => $absent->Id,
                ]);
            }
        } else if ($absent->Status == 'PENDING') {
            $urlNoti = env('NOTI_URL') . '/api/notification';
            $parents = $absent->student->parent;
            $userId = [];

            if (!empty($parents)) {
                foreach ($parents as $parent) {
                    if (!is_null($parent->account)) {
                        $userId[] = $parent->account->AppUserId;
                    }
                }
            }

            $nameStudent = $absent->student->FullName;
            $images =  $absent->student->FileImage;
            $urlImage = '';

            if (!is_null($images)) {
                $images = json_decode($images);
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $startDate = $absent->StartDate->format('d-m');
            $endDate = $absent->EndDate->format('d-m');
            if (!empty($userId)) {
                Http::post("$urlNoti", [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => "Đơn xin phép nghỉ được thay đổi từ ngày $startDate đến ngày $endDate cần Phụ huynh duyệt đơn.",
                    'moduleType' => 9,
                    'refId' => $absent->Id,
                ]);
            }
        }

        return parent::find($id);
    }

    public function confirm(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        $absent->update([
            "status" => $attributes['status'],
        ]);

        $begin = new \DateTime($absent->StartDate);
        $end = new \DateTime($absent->EndDate);
        $intervalDate = new \DateInterval('P1D');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);

        foreach ($periodDate as $date) {
            $attendance = Attendance::where('StudentId', $absent->StudentId)->where('Date', $date->format('Y-m-d'))->first();
            if (is_null($attendance)) {
                $attendance = Attendance::create([
                    'StudentId' => $absent->StudentId,
                    'Date' => $date->format('Y-m-d'),
                    'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                ]);
            } else {
                $attendance->update([
                    'StudentId' => $absent->StudentId,
                    'Date' => $date->format('Y-m-d'),
                    'Status' => Attendance::STATUS['ANNUAL_LEAVE'],
                ]);
            }
        }

        $urlNoti = env('NOTI_URL') . '/api/notification';
        $teachers = $absent->student->classStudent->classes->teacher;
        $userId = [];

        if (!empty($teachers)) {
            foreach ($teachers as $teacher) {
                if (!is_null($teacher->account)) {
                    $userId[] = $teacher->account->AppUserId;
                }
            }
        }

        $nameStudent = $absent->student->FullName;
        $images =  $absent->student->FileImage;
        $urlImage = '';

        if (!is_null($images)) {
            $images = json_decode($images);
            $urlImage = env('IMAGE_URL') . $images[0];
        }

        $startDate = $absent->StartDate->format('d-m');
        $endDate = $absent->EndDate->format('d-m');

        if (!empty($userId)) {
            Http::post("$urlNoti", [
                'users' => $userId,
                'title' => $nameStudent,
                'imageURL' => $urlImage,
                'message' => "Bé $nameStudent xin nghỉ phép ngày $startDate - $endDate",
                'moduleType' => 9,
                'refId' => $absent->Id,
            ]);
        }

        return parent::find($id);
    }
}
