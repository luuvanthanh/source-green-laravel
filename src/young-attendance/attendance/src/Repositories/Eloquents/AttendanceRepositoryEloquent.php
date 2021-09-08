<?php

namespace GGPHP\Attendance\Repositories\Eloquents;

use Carbon\Carbon;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Attendance\Presenters\AttendancePresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceRepository;
use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AttendanceRepositoryEloquent.
 *
 * @package GGPHP\Attendance\Repositories\Eloquents;
 */
class AttendanceRepositoryEloquent extends BaseRepository implements AttendanceRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
    ];

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Application $app
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
        return Attendance::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return AttendancePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Save many entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function create(array $attributes)
    {
        $now = Carbon::now('GMT+7')->format('H:i:s');

        switch ($attributes['status']) {
            case 3:
                $attributes['checkIn'] = $now;
                break;
            case 4:
                $attributes['checkOut'] = $now;
                break;
            default:
                break;
        }

        $attendance = Attendance::where('StudentId', $attributes['studentId'])->where('Date', $attributes['date'])->first();

        if (!empty($attributes['studentTransporter'])) {
            if (is_array($attributes['studentTransporter'])) {
                $studentTransporter = StudentTransporter::create($attributes['studentTransporter']);
                $attributes['studentTransporterId'] = $studentTransporter->Id;
            } else {
                $attributes['studentTransporterId'] = $attributes['studentTransporter'];
            }
        }

        if (is_null($attendance)) {
            $attendance = Attendance::create($attributes);

            $reason = $attendance->reason;
            $attendanceReason = $attendance->attendanceReason ? $attendance->attendanceReason->Content : null;

            AttendanceLog::create([
                'EmployeeId' => $attributes['employeeId'],
                'AttendanceId' => $attendance->Id,
                'Action' => 'Tạo mới điểm danh',
                'Reason' => $reason ? $reason : $attendanceReason,
            ]);

            $parents = $attendance->student->parent;
            $userId = [];

            if (!empty($parents)) {
                foreach ($parents as $parent) {
                    if (!is_null($parent->account)) {
                        $userId[] = $parent->account->AppUserId;
                    }
                }
            }

            $nameStudent = $attendance->student->FullName;
            $message = '';
            switch ($attendance->Status) {
                case 2:
                    $date = $attendance->Date->format('d-m-Y');
                    $message = "Bé $nameStudent vắng không phép ngày $date";
                    break;
                case 3:
                    $timeCheckIn = $attendance->CheckIn;
                    $message = "Bé $nameStudent đã vào lớp lúc $timeCheckIn";
                    break;
                case 4:
                    $timeCheckOut = $attendance->CheckOut;

                    $textTransporter = '';
                    if(!is_null($attendance->studentTransporter)){
                        $transporter = $attendance->studentTransporter;
                        $nameTransporter = $transporter->FullName;
                        $relationshipTransporter = $transporter->Relationship;
                        $textTransporter = "do $nameTransporter - $relationshipTransporter của bé đón về";
                    }

                    $message = "Bé $nameStudent đã ra về  lúc $timeCheckOut $textTransporter";
                    break;
                default:
                    break;
            }

            $images =  $attendance->student->FileImage;
            $urlImage = '';

            if (!is_null($images)) {
                $images = json_decode($images);
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 6,
                    'refId' => $attributes['studentId'],
                ];

                dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
            }
        } else {

            $attendance->update($attributes);

            $reason = $attendance->reason;
            $attendanceReason = $attendance->attendanceReason ? $attendance->attendanceReason->Content : null;

            AttendanceLog::create([
                'EmployeeId' => $attributes['employeeId'],
                'AttendanceId' => $attendance->Id,
                'Action' => 'Cập nhật điểm danh',
                'Reason' => $reason ? $reason : $attendanceReason,
            ]);

            $parents = $attendance->student->parent;
            $userId = [];

            if (!empty($parents)) {
                foreach ($parents as $parent) {
                    if (!is_null($parent->account)) {
                        $userId[] = $parent->account->AppUserId;
                    }
                }
            }

            $nameStudent = $attendance->student->FullName;
            $message = '';

            switch ($attendance->Status) {
                case 2:
                    $date = $attendance->Date->format('d-m-Y');
                    $message = "Bé $nameStudent vắng không phép ngày $date";
                    break;
                case 3:
                    $timeCheckIn = $attendance->CheckIn;
                    $message = "Bé $nameStudent đã vào lớp lúc $timeCheckIn";
                    break;
                case 4:
                    $timeCheckOut = $attendance->CheckOut;
                    $textTransporter = '';
                    if(!is_null($attendance->studentTransporter)){
                        $transporter = $attendance->studentTransporter;
                        $nameTransporter = $transporter->FullName;
                        $relationshipTransporter = $transporter->Relationship;
                        $textTransporter = "do $nameTransporter - $relationshipTransporter của bé đón về";
                    }

                    $message = "Bé $nameStudent đã ra về  lúc $timeCheckOut $textTransporter";
                    break;
                default:
                    break;
            }

            $images =  $attendance->student->FileImage;
            $urlImage = '';

            if (!is_null($images)) {
                $images = json_decode($images);
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 6,
                    'refId' => $attributes['studentId'],
                ];

                dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
            }
        }

        return $this->parserResult($attendance);
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAttendance($attributes)
    {
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['attendance' => function ($query) use ($attributes) {
            if (!empty($attributes['date'])) {
                $query->where('Date', $attributes['date']);
            }

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['status'])) {
                $query->whereIn('Status', $attributes['status']);
            }

            $query->orderBy('Date','DESC');
        }]);

        if (!empty($attributes['isAttendance'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('attendance', function ($query) use ($attributes) {
                if (!empty($attributes['date'])) {
                    $query->where('Date', $attributes['date']);
                }

                if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                    $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
                }

                if (!empty($attributes['status'])) {
                    $query->whereIn('Status', $attributes['status']);
                }
            });
        }

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['date'])) {
                $query->where([['StartDate', '<=', $attributes['date']], ['EndDate', '>=', $attributes['date']]]);
            }

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            }
        }]);

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['inOutHistory' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->where([['AttendedAt', '>=', $attributes['startDate']], ['AttendedAt', '<=', $attributes['endDate']]]);
            }
        }]);

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereIn('Id', $studentId);
        }

        if (!empty($attributes['nameStudent'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereLike('FullName', $attributes['nameStudent']);
        }

        if (!empty($attributes['fullName'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereLike('FullName', $attributes['fullName']);
        }

        if (!empty($attributes['classId'])) {
            $classId = explode(',', $attributes['classId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($classId) {
                $query->whereIn('ClassId', $classId);
            });
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($branchId) {
                $query->whereHas('classes', function ($query2) use ($branchId) {
                    $query2->whereIn('BranchId', $branchId);
                });
            });
        }

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', '!=', Student::STORE);

        if (!empty($attributes['limit'])) {
            $inOutHistories = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $inOutHistories = $this->studentRepositoryEloquent->get();
        }

        return $inOutHistories;
    }

    public function attendanceCrontab($attributes)
    {
        $students = Student::with(['inOutHistory'])->where('Status', '!=', Student::STORE)->get();
        $date = !empty($attributes['date']) ? $attributes['date'] : Carbon::now('GMT+7')->format('Y-m-d');

        foreach ($students as $student) {
            $studentTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($student->Id, $date, $date);

            if (!empty($studentTimeWorkShift)) {
                $timekeepings = $student->inOutHistory()->whereDate('AttendedAt', date($date))->get();

                $timeShift = [];
                $nowHours = !empty($attributes['time']) ? $attributes['time'] : Carbon::now('GMT+7')->format('H:i:s');

                foreach ($studentTimeWorkShift[$date] as $key => $value) {
                    $timeShift[] = $value['StartTime'] . ' - ' . $value['EndTime'];
                }

                $shift = Shift::findOrFail($studentTimeWorkShift[$date][0]['ShiftId']);

                foreach ($studentTimeWorkShift[$date] as $key => $value) {
                    $timeAllow = $this->checkTimeAllow($date, $value);

                    // Vào lớp
                    if ($nowHours > Carbon::parse($timeAllow['validBeforeStartTime'])->format('H:i:s')) {
                        $inOutAfterTimeStart = $student->inOutHistory()
                            ->where([['AttendedAt', '>=', $timeAllow['validBeforeStartTime']]])
                            ->where([['AttendedAt', '<=', $timeAllow['validAfterStartTime']]])
                            ->orderBy('AttendedAt')
                            ->get();

                        if (count($inOutAfterTimeStart) > 0) {
                            //kiểm tra tồn tại vào lớp chưa
                            $existCheckIn = Attendance::where('StudentId', $student->Id)
                                ->whereDate('Date', $date)
                                ->where(function ($query) {
                                    $query->where('Status', Attendance::STATUS['HAVE_IN'])
                                        ->orWhere('Status', Attendance::STATUS['HAVE_OUT'])
                                        ->orWhere('Status', Attendance::STATUS['ANNUAL_LEAVE'])
                                        ->orWhere('Status', Attendance::STATUS['UNPAID_LEAVE']);
                                })->get();

                            if (count($existCheckIn) == 0) {

                                $dataCheckIn = [
                                    'Date' => $date,
                                    'StudentId' => $student->Id,
                                    'Status' => Attendance::STATUS['HAVE_IN'],
                                    'CheckIn' => $inOutAfterTimeStart[0]->AttendedAt->format('H:i:s'),
                                ];

                                $attendance = $this->model->create($dataCheckIn);

                                $urlNoti = env('NOTI_URL') . '/api/notification';
                                $parents = $student->parent;
                                $userId = [];

                                if (!empty($parents)) {
                                    foreach ($parents as $parent) {
                                        if (!is_null($parent->account)) {
                                            $userId[] = $parent->account->AppUserId;
                                        }
                                    }
                                }

                                $nameStudent = $student->FullName;
                                $images =  $student->FileImage;
                                $urlImage = '';

                                if (!is_null($images)) {
                                    $images = json_decode($images);
                                    $urlImage = env('IMAGE_URL') . $images[0];
                                }

                                $timeCheckIn = $inOutAfterTimeStart[0]->AttendedAt->format('H:i:s');
                                $message = "Bé $nameStudent đã vào lớp lúc $timeCheckIn";

                                if (!empty($userId)) {
                                    $dataNoti = [
                                        'users' => $userId,
                                        'title' => $nameStudent,
                                        'imageURL' => $urlImage,
                                        'message' => $message,
                                        'moduleType' => 6,
                                        'refId' => $student->Id,
                                    ];
                    
                                    dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                                }
                            }
                        }
                    }

                    // ra về
                    if ($nowHours > Carbon::parse($timeAllow['validBeforeEndTime'])->format('H:i:s')) {
                        $inOutAfterTimeEnd = $student->inOutHistory()
                            ->where([['AttendedAt', '>=', $timeAllow['validBeforeEndTime']]])
                            ->where([['AttendedAt', '<=', $timeAllow['validAfterEndTime']]])
                            ->orderBy('AttendedAt')
                            ->get();
                        if (count($inOutAfterTimeEnd) > 0) {
                            //kiểm tra tồn tại ra về chưa
                            $existCheckOut = Attendance::where('StudentId', $student->Id)
                                ->whereDate('Date', $date)
                                ->where(function ($query) {
                                    $query->where('Status', Attendance::STATUS['HAVE_OUT'])
                                        ->orWhere('Status', Attendance::STATUS['ANNUAL_LEAVE'])
                                        ->orWhere('Status', Attendance::STATUS['HAVE_IN']);
                                })->get();

                            if (count($existCheckOut) == 0) {
                                $dataCheckOut = [
                                    'Date' => $date,
                                    'StudentId' => $student->Id,
                                    'Status' => Attendance::STATUS['HAVE_OUT'],
                                    'CheckOut' => $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s'),
                                ];

                                $this->model->create($dataCheckOut);

                                $urlNoti = env('NOTI_URL') . '/api/notification';
                                $parents = $student->parent;
                                $userId = [];

                                if (!empty($parents)) {
                                    foreach ($parents as $parent) {
                                        if (!is_null($parent->account)) {
                                            $userId[] = $parent->account->AppUserId;
                                        }
                                    }
                                }

                                $nameStudent = $student->FullName;
                                $images =  $student->FileImage;
                                $urlImage = '';

                                if (!is_null($images)) {
                                    $images = json_decode($images);
                                    $urlImage = env('IMAGE_URL') . $images[0];
                                }

                                $timeCheckOut = $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s');
                                $message = "Bé $nameStudent đã ra về lúc $timeCheckOut";


                                if (!empty($userId)) {
                                    $dataNoti = [
                                        'users' => $userId,
                                        'title' => $nameStudent,
                                        'imageURL' => $urlImage,
                                        'message' => $message,
                                        'moduleType' => 6,
                                        'refId' => $student->Id,
                                    ];
                    
                                    dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                                }
                            } else if ($existCheckOut[0]->Status == Attendance::STATUS['HAVE_IN']) {

                                $existCheckOut[0]->update([
                                    'Status' => Attendance::STATUS['HAVE_OUT'],
                                    'CheckOut' => $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s'),
                                ]);

                                $urlNoti = env('NOTI_URL') . '/api/notification';
                                $parents = $student->parent;
                                $userId = [];

                                if (!empty($parents)) {
                                    foreach ($parents as $parent) {
                                        if (!is_null($parent->account)) {
                                            $userId[] = $parent->account->AppUserId;
                                        }
                                    }
                                }

                                $nameStudent = $student->FullName;
                                $images =  $student->FileImage;
                                $urlImage = '';

                                if (!is_null($images)) {
                                    $images = json_decode($images);
                                    $urlImage = env('IMAGE_URL') . $images[0];
                                }

                                $timeCheckOut = $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s');
                                $message = "Bé $nameStudent đã ra về lúc $timeCheckOut";

                                if (!empty($userId)) {
                                    $dataNoti = [
                                        'users' => $userId,
                                        'title' => $nameStudent,
                                        'imageURL' => $urlImage,
                                        'message' => $message,
                                        'moduleType' => 6,
                                        'refId' => $student->Id,
                                    ];
                    
                                    dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                                }
                            }
                        }
                    }

                    // //vắng không phép
                    if ($nowHours > Carbon::parse($timeAllow['validAfterStartTime'])->format('H:i:s')) {
                        $existCheckIn = Attendance::where('StudentId', $student->Id)
                            ->whereDate('Date', $date)
                            ->where(function ($query) {
                                $query->where('Status', Attendance::STATUS['HAVE_IN'])
                                    ->orWhere('Status', Attendance::STATUS['HAVE_OUT'])
                                    ->orWhere('Status', Attendance::STATUS['ANNUAL_LEAVE'])
                                    ->orWhere('Status', Attendance::STATUS['UNPAID_LEAVE']);
                            })->get();

                        if (count($existCheckIn) == 0) {
                            $dataCheckOut = [
                                'Date' => $date,
                                'StudentId' => $student->Id,
                                'Status' => Attendance::STATUS['UNPAID_LEAVE'],
                            ];

                            $this->model->create($dataCheckOut);

                            $urlNoti = env('NOTI_URL') . '/api/notification';
                            $parents = $student->parent;
                            $userId = [];

                            if (!empty($parents)) {
                                foreach ($parents as $parent) {
                                    if (!is_null($parent->account)) {
                                        $userId[] = $parent->account->AppUserId;
                                    }
                                }
                            }

                            $nameStudent = $student->FullName;
                            $images =  $student->FileImage;
                            $urlImage = '';

                            if (!is_null($images)) {
                                $images = json_decode($images);
                                $urlImage = env('IMAGE_URL') . $images[0];
                            }

                            $message = "Bé $nameStudent vắng không phép ngày $date";

                            if (!empty($userId)) {
                                $dataNoti = [
                                    'users' => $userId,
                                    'title' => $nameStudent,
                                    'imageURL' => $urlImage,
                                    'message' => $message,
                                    'moduleType' => 6,
                                    'refId' => $student->Id,
                                ];
                
                                dispatch( new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                            }
                        }
                    }
                }
            }
        }

        return;
    }

    /**
     * @param $dateAttend
     * @param $item
     * @return mixed
     */
    public function checkTimeAllow($dateAttend, $item)
    {

        $durationAllow['validBeforeStartTime'] = Carbon::parse($dateAttend . '' . $item['StartTime'])->subMinutes(30)->toDateTimeString();
        $durationAllow['validAfterStartTime'] = Carbon::parse($dateAttend . '' . $item['StartTime'])->addMinutes(30)->toDateTimeString();
        $durationAllow['validBeforeEndTime'] = Carbon::parse($dateAttend . '' . $item['EndTime'])->subMinutes(30)->toDateTimeString();
        $durationAllow['validAfterEndTime'] = Carbon::parse($dateAttend . '' . $item['EndTime'])->addMinutes(30)->toDateTimeString();

        return $durationAllow;
    }

    public function attendanceSummary(array $attributes)
    {
        $student = Student::query();

        $student->where('Status', '!=', Student::STORE);

        if (!empty($attributes['classId'])) {
            $classId = explode(',', $attributes['classId']);
            $student->whereIn('ClassId', $classId);
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $student->whereHas('classStudent', function ($query) use ($branchId) {
                $query->whereHas('classes', function ($query2) use ($branchId) {
                    $query2->whereIn('BranchId', $branchId);
                });
            });
        }

        $attendanceHaveIn = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where(function ($query) {
            $query->where('Status', Attendance::STATUS['HAVE_IN'])->orWhere('Status', Attendance::STATUS['HAVE_OUT']);
        })->count();

        $attendanceAnnualLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->count();
        $attendanceUnpaidLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['UNPAID_LEAVE'])->count();

        return [
            'data' => [
                'student' => $student->count(),
                'haveIn' => $attendanceHaveIn,
                'annualLeave' => $attendanceAnnualLeave,
                'unpaidLeave' => $attendanceUnpaidLeave,
            ],
        ];
    }

    public function attendanceSummaryByClass(array $attributes)
    {
        $queryClass = Classes::query();

        if (!empty($attributes['classId'])) {
            $queryClass->whereIn('Id', explode(',', $attributes['classId']));
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $queryClass->whereIn('BranchId', $branchId);
        }

        $class = $queryClass->where('IsDeleted', false)->get();

        $class->map(function ($item) use ($attributes) {
            $student = Student::where('ClassId', $item->Id)->where('Status', '!=', Student::STORE)->get();

            $attendanceHaveIn = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where(function ($query) {
                $query->where('Status', Attendance::STATUS['HAVE_IN']);
            })->count();
            $attendanceHaveOut = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where(function ($query) {
                $query->where('Status', Attendance::STATUS['HAVE_OUT']);
            })->count();

            $attendanceAnnualLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->count();
            $attendanceUnpaidLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['UNPAID_LEAVE'])->count();

            $item->report = [
                "totalStudent" => count($student),
                "haveIn" => $attendanceHaveIn,
                "haveOut" => $attendanceHaveOut,
                "annualLeave" => $attendanceAnnualLeave,
                "unpaidLeave" => $attendanceUnpaidLeave
            ];
        });

        $result = $class->toArray();

        foreach ($result as $key => $value) {
            foreach ($value as $keyItem => $item) {

                $newkeyItem = dashesToCamelCase($keyItem, false);

                if ($keyItem != $newkeyItem) {
                    $value[$newkeyItem] = $value[$keyItem];

                    unset($value[$keyItem]);
                }
            }
            $result[$key] = $value;
        }

        return [
            'data' => $result
        ];
    }
}
