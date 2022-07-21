<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Clover\Repositories\Eloquent\ClassRepositoryEloquent;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Models\AbsentStudentDetail;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentPresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends CoreRepositoryEloquent implements AbsentRepository
{
    protected $fieldSearchable = [
        'AbsentTypeId',
        'AbsentReasonId',
        'StartDate',
        'LastModificationTime',
        'CreationTime'
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

        if (!empty($attributes['classId'])) {
            $classId = explode(',', $attributes['classId']);
            $this->model = $this->model->whereHas('student', function ($query) use ($classId) {
                $query->whereHas('classStudent', function ($q) use ($classId) {
                    $q->whereIn('ClassId', $classId);
                });
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
            $begin = new \DateTime($attributes['startDate']);
            $end = new \DateTime($attributes['endDate'] . '23:59');
            $intervalDate = new \DateInterval('P1D');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);
            $now = Carbon::now();

            foreach ($periodDate as $date) {

                if (Carbon::parse($date)->dayOfWeek == Carbon::SATURDAY && Carbon::parse($date)->dayOfWeek == Carbon::SUNDAY) {
                    continue;
                }

                $isRefunds = false;

                if ($date->format('Y-m-d') == $now->format('Y-m-d')) {
                    $isRefunds = true;
                }

                AbsentStudentDetail::create([
                    'absentStudentId' => $absent->Id,
                    'date' => $date->format('Y-m-d'),
                    'isRefunds' => $isRefunds,
                ]);
            }

            if ($absent->Status == 'CONFIRM') {

                foreach ($periodDate as $date) {

                    if (Carbon::parse($date)->dayOfWeek == Carbon::SATURDAY && Carbon::parse($date)->dayOfWeek == Carbon::SUNDAY) {
                        continue;
                    }

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
                $images =  json_decode($absent->student->FileImage);
                $urlImage = '';

                if (!empty($images)) {
                    $urlImage = env('IMAGE_URL') . $images[0];
                }

                $startDate = $absent->StartDate->format('d-m');
                $endDate = $absent->EndDate->format('d-m');
                $message = 'Bé' . ' ' . $nameStudent . ' ' . 'xin nghỉ phép ngày' . ' ' . $startDate . '-' . $endDate;

                if (!empty($userId)) {
                    $dataNoti = [
                        'users' => $userId,
                        'title' => $nameStudent,
                        'imageURL' => $urlImage,
                        'message' => $message,
                        'moduleType' => 9,
                        'moduleCode' => 'ABSENT_STUDENT',
                        'refId' => $absent->Id,
                    ];

                    dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                }
            } else {
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
                $images =  json_decode($absent->student->FileImage);
                $urlImage = '';

                if (!empty($images)) {
                    $urlImage = env('IMAGE_URL') . $images[0];
                }
                $startDate = $absent->StartDate->format('d-m');
                $endDate = $absent->EndDate->format('d-m');
                $message = 'Đơn xin phép nghỉ từ ngày' . ' ' . $startDate . ' ' . 'đến ngày' . ' ' . $endDate . ' ' . 'cần Phụ huynh duyệt đơn.';

                if (!empty($userId)) {
                    $dataNoti = [
                        'users' => $userId,
                        'title' => $nameStudent,
                        'imageURL' => $urlImage,
                        'message' => $message,
                        'moduleType' => 9,
                        'moduleCode' => 'ABSENT_STUDENT',
                        'refId' => $absent->Id,
                    ];

                    dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
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

        $absent->absentStudentDetail()->delete();

        $begin = new \DateTime($attributes['startDate']);
        $end = new \DateTime($attributes['endDate'] . '23:59');
        $intervalDate = new \DateInterval('P1D');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        $now = Carbon::now();

        foreach ($periodDate as $date) {
            $isRefunds = false;

            if ($date->format('Y-m-d') == $now->format('Y-m-d')) {
                $isRefunds = true;
            }

            AbsentStudentDetail::create([
                'absentStudentId' => $absent->Id,
                'date' => $date->format('Y-m-d'),
                'isRefunds' => $isRefunds,
            ]);
        }

        if ($absent->Status == 'CONFIRM') {
            $beginOld = new \DateTime($absent->StartDate);
            $endOld = new \DateTime($absent->EndDate);
            $intervalDateOld = \DateInterval::createFromDateString('1 day');
            $periodDateOld = new \DatePeriod($beginOld, $intervalDateOld, $endOld);

            foreach ($periodDateOld as $date) {
                Attendance::where('StudentId', $attributes['studentId'])->where('Date', $date->format('Y-m-d'))
                    ->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->delete();
            }

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
            $images =  json_decode($absent->student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $startDate = $absent->StartDate->format('d-m');
            $endDate = $absent->EndDate->format('d-m');
            $message = 'Bé'  . ' ' . $nameStudent . ' ' . 'xin nghỉ phép được thay đổi ngày' . ' ' . $startDate . '-' . $endDate;

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 9,
                    'moduleCode' => 'ABSENT_STUDENT',
                    'refId' => $absent->Id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
            }
        } elseif ($absent->Status == 'PENDING') {
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
            $images =  json_decode($absent->student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $startDate = $absent->StartDate->format('d-m');
            $endDate = $absent->EndDate->format('d-m');
            $message = 'Đơn xin phép nghỉ được thay đổi từ ngày' . ' ' . $startDate . ' ' .  'đến ngày' . ' ' . $endDate . ' ' . 'cần Phụ huynh duyệt đơn.';

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 9,
                    'moduleCode' => 'ABSENT_STUDENT',
                    'refId' => $absent->Id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
            }
        }

        return parent::find($id);
    }

    public function confirm(array $attributes, $id)
    {
        $absent = Absent::findOrFail($id);

        $absent->update([
            'status' => $attributes['status'],
        ]);

        $begin = new \DateTime($absent->StartDate);
        $end = new \DateTime($absent->EndDate);
        $intervalDate = new \DateInterval('P1D');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);

        if ($periodDate->start == $periodDate->end) {
            $date = $periodDate->start;
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
        $images =  json_decode($absent->student->FileImage);
        $urlImage = '';

        if (!empty($images)) {
            $urlImage = env('IMAGE_URL') . $images[0];
        }

        $startDate = $absent->StartDate->format('d-m');
        $endDate = $absent->EndDate->format('d-m');

        $message = 'Bé' . ' ' . $nameStudent . ' ' . 'xin nghỉ phép ngày' . ' ' . $startDate . '-' . $endDate;

        if (!empty($userId)) {
            $dataNoti = [
                'users' => $userId,
                'title' => $nameStudent,
                'imageURL' => $urlImage,
                'message' => $message,
                'moduleType' => 9,
                'moduleCode' => 'ABSENT_STUDENT',
                'refId' => $absent->Id,
            ];

            dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
        }

        return parent::find($id);
    }

    public function notRefundStudent(array $attributes)
    {
        $classRepositoryEloquent = resolve(ClassRepositoryEloquent::class);

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $classRepositoryEloquent->model = $classRepositoryEloquent->model->whereIn('BranchId', $branchId);
        }

        if (!empty($attributes['classId'])) {
            $classId = explode(',', $attributes['classId']);
            $classRepositoryEloquent->model = $classRepositoryEloquent->model->whereIn('Id', $classId);
        }

        $classRepositoryEloquent->model = $classRepositoryEloquent->model->whereHas('student', function ($query) use ($attributes) {
            $query->whereHas('absent', function ($queryAbsent) use ($attributes) {
                $queryAbsent->whereHas('absentStudentDetail', function ($queryAbsentDetail) use ($attributes) {
                    $queryAbsentDetail->where('IsRefunds', true);
                    if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                        $queryAbsentDetail->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
                    }
                });
            });
        })->with(['student' => function ($query) use ($attributes) {
            $query->whereHas('absent', function ($queryAbsent) use ($attributes) {
                $queryAbsent->whereHas('absentStudentDetail', function ($queryAbsentDetail) use ($attributes) {
                    $queryAbsentDetail->where('IsRefunds', true);
                    if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                        $queryAbsentDetail->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
                    }
                });
            })->with(['absent' => function ($queryAbsent) use ($attributes) {
                $queryAbsent->whereHas('absentStudentDetail', function ($queryAbsentDetail) use ($attributes) {
                    $queryAbsentDetail->where('IsRefunds', true);
                    if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                        $queryAbsentDetail->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
                    }
                })->with(['absentStudentDetail' => function ($queryAbsentDetail) use ($attributes) {
                    $queryAbsentDetail->where('IsRefunds', true);
                    if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                        $queryAbsentDetail->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
                    }
                }]);
            }]);
        }]);

        if (!empty($attributes['limit'])) {
            $class = $classRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $class = $classRepositoryEloquent->get();
        }

        return $class;
    }

    public function delete($id)
    {
        $absent = Absent::findOrFail($id);

        \DB::beginTransaction();
        try {
            $beginOld = new \DateTime($absent->StartDate);
            $endOld = new \DateTime($absent->EndDate);
            $intervalDateOld = \DateInterval::createFromDateString('1 day');
            $periodDateOld = new \DatePeriod($beginOld, $intervalDateOld, $endOld);

            foreach ($periodDateOld as $date) {
                Attendance::where('StudentId', $absent->StudentId)->where('Date', $date->format('Y-m-d'))
                    ->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->delete();
            }

            $absent->delete();
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return $absent;
    }
}
