<?php

namespace GGPHP\Attendance\Repositories\Eloquents;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Attendance\Presenters\AttendancePresenter;
use GGPHP\Attendance\Repositories\Contracts\AttendanceRepository;
use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Models\ClassStudent;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Models\StudentTransporter;
use GGPHP\Clover\Models\TimetableSetting;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Http;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
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
        ExcelExporterServices $excelExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
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
                $studentTransporter = StudentTransporter::insert([
                    'Id' => \Webpatser\Uuid\Uuid::generate(4)->string,
                    'FullName' => $attributes['studentTransporter']['fullName'],
                    'Relationship' => $attributes['studentTransporter']['relationship'],
                    'StudentId' => $attributes['studentId'],
                    'CreationTime' => Carbon::now()->format('Y-m-d H:i:s'),
                ]);

                $studentTransporter = StudentTransporter::where('StudentId', $attributes['studentId'])->orderBy('CreationTime', 'DESC')->first();

                $attributes['studentTransporterId'] = $studentTransporter->Id;
            } else {
                $attributes['studentTransporterId'] = $attributes['studentTransporter'];
            }
        }

        if (is_null($attendance)) {
            $attendance = Attendance::create($attributes);

            $reason = $attendance->reason;
            $attendanceReason = $attendance->attendanceReason ? $attendance->attendanceReason->Content : null;

            if ($attendance->Status == 3 || $attendance->Status == 4) {
                $action = $attendance->Status == 3 ? 'Vào lớp' : 'Ra về';
                AttendanceLog::create([
                    'EmployeeId' => $attributes['employeeId'],
                    'AttendanceId' => $attendance->Id,
                    'Action' => $action,
                    'Reason' => $reason ? $reason : $attendanceReason,
                ]);
            }

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
                    $message = 'Bé' . ' ' . $nameStudent . ' ' . 'vắng không phép ngày' . ' ' . $date;
                    break;
                case 3:
                    $timeCheckIn = $attendance->CheckIn;
                    $message = 'Bé' . ' ' .  $nameStudent . ' ' . 'đã vào lớp lúc' . ' ' . $timeCheckIn;
                    break;
                case 4:
                    $timeCheckOut = $attendance->CheckOut;

                    $textTransporter = '';
                    if (!is_null($attendance->studentTransporter)) {
                        $transporter = $attendance->studentTransporter;
                        $nameTransporter = $transporter->FullName;
                        $relationshipTransporter = $transporter->Relationship;
                        $textTransporter = 'do' . ' ' . $nameTransporter .  '-' . $relationshipTransporter . ' ' . 'của bé đón về';
                    }

                    $message = 'Bé' . ' ' . $nameStudent . ' ' . 'đã ra về  lúc' . ' ' . $timeCheckOut . ' ' . $textTransporter;
                    break;
                default:
                    break;
            }

            $images =  json_decode($attendance->student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 6,
                    'moduleCode' => 'ATTENDANCE',
                    'refId' => $attributes['studentId'],
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
            }
        } else {

            $attendance->update($attributes);

            $reason = $attendance->reason;
            $attendanceReason = $attendance->attendanceReason ? $attendance->attendanceReason->Content : null;

            if ($attendance->Status == 3 || $attendance->Status == 4) {
                $action = $attendance->Status == 3 ? 'Vào lớp' : 'Ra về';
                AttendanceLog::create([
                    'EmployeeId' => $attributes['employeeId'],
                    'AttendanceId' => $attendance->Id,
                    'Action' => $action,
                    'Reason' => $reason ? $reason : $attendanceReason,
                ]);
            }

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
                    $message = 'Bé' . ' ' . $nameStudent . ' ' . 'vắng không phép ngày' . ' ' . $date;
                    break;
                case 3:
                    $timeCheckIn = $attendance->CheckIn;
                    $message = 'Bé' . ' ' . $nameStudent . ' ' . 'đã vào lớp lúc' . ' ' . $timeCheckIn;
                    break;
                case 4:
                    $timeCheckOut = $attendance->CheckOut;
                    $textTransporter = '';
                    if (!is_null($attendance->studentTransporter)) {
                        $transporter = $attendance->studentTransporter;
                        $nameTransporter = $transporter->FullName;
                        $relationshipTransporter = $transporter->Relationship;
                        $textTransporter = 'do' . ' ' . $nameTransporter . '-' . $relationshipTransporter . ' ' .  'của bé đón về';
                    }

                    $message = 'Bé' . ' ' . $nameStudent . ' ' . 'đã ra về  lúc' . ' ' . $timeCheckOut . ' ' . $textTransporter;
                    break;
                default:
                    break;
            }

            $images =  json_decode($attendance->student->FileImage);
            $urlImage = '';


            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            if (!empty($userId)) {
                $dataNoti = [
                    'users' => $userId,
                    'title' => $nameStudent,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 6,
                    'moduleCode' => 'ATTENDANCE',
                    'refId' => $attributes['studentId'],
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
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

            $query->orderBy('Date', 'DESC');
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

        //$this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', '!=', Student::STORE);
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', '=', Student::OFFICAL);
        if (!empty($attributes['excel']) && $attributes['excel'] == 'true') {
            $inOutHistories = $this->studentRepositoryEloquent->model->orderBy('CreationTime', 'desc')->get();
            return $inOutHistories;
        }

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

        $timetableSetting = TimetableSetting::whereDate('FromDate', '<=', $date)->whereDate('ToDate', '>=', $date)->first();

        if (!is_null($timetableSetting) && Carbon::parse($date)->dayOfWeek != Carbon::THURSDAY && Carbon::parse($date)->dayOfWeek != Carbon::SUNDAY) {
            foreach ($students as $student) {
                $nowHours = !empty($attributes['time']) ? $attributes['time'] : Carbon::now('GMT+7')->format('H:i:s');

                $valueTimeAllow = [
                    'StartTime' => $timetableSetting->FromTime,
                    'EndTime' => $timetableSetting->ToTime
                ];

                $timeAllow = $this->checkTimeAllow($date, $valueTimeAllow);

                //chưa vào lớp
                if ($nowHours < Carbon::parse($timeAllow['validBeforeStartTime'])->format('H:i:s')) {
                    $existNotInClass = Attendance::where('StudentId', $student->Id)
                        ->whereDate('Date', $date)
                        ->first();

                    if (is_null($existNotInClass)) {
                        $dataNotInClass = [
                            'Date' => $date,
                            'StudentId' => $student->Id,
                            'Status' => Attendance::STATUS['NOT_IN_CLASS'],
                        ];

                        $this->model->create($dataNotInClass);
                    }
                }

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
                            $existAttendance = Attendance::where('StudentId', $student->Id)
                                ->whereDate('Date', $date)
                                ->first();

                            if (is_null($existAttendance)) {
                                $dataCheckIn = [
                                    'Date' => $date,
                                    'StudentId' => $student->Id,
                                    'Status' => Attendance::STATUS['HAVE_IN'],
                                    'CheckIn' => $inOutAfterTimeStart[0]->AttendedAt->format('H:i:s'),
                                    'IsHaveInAi' => true
                                ];

                                $existAttendance = $this->model->create($dataCheckIn);
                            } else {
                                $existAttendance->update([
                                    'Status' => Attendance::STATUS['HAVE_IN'],
                                    'CheckIn' => $inOutAfterTimeStart[0]->AttendedAt->format('H:i:s'),
                                    'IsHaveInAi' => true
                                ]);
                            }

                            AttendanceLog::create([
                                'AttendanceId' => $existAttendance->Id,
                                'Action' => 'Vào lớp',
                                'Type' => 'CAMERA_AI',
                                'FileImage' =>  $inOutAfterTimeStart[0]->FileImage
                            ]);

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
                            $images =  json_decode($student->FileImage);
                            $urlImage = '';

                            if (!empty($images)) {
                                $urlImage = env('IMAGE_URL') . $images[0];
                            }

                            $timeCheckIn = $inOutAfterTimeStart[0]->AttendedAt->format('H:i:s');
                            $message = 'Bé' . ' ' . $nameStudent . ' ' . 'đã vào lớp lúc' . ' ' . $timeCheckIn;

                            if (!empty($userId)) {
                                $dataNoti = [
                                    'users' => $userId,
                                    'title' => $nameStudent,
                                    'imageURL' => $urlImage,
                                    'message' => $message,
                                    'moduleType' => 6,
                                    'moduleCode' => 'ATTENDANCE',
                                    'refId' => $student->Id,
                                ];

                                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
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
                                    ->orWhere('Status', Attendance::STATUS['ANNUAL_LEAVE']);
                            })->get();

                        if (count($existCheckOut) == 0) {
                            $existAttendance = Attendance::where('StudentId', $student->Id)
                                ->whereDate('Date', $date)
                                ->where(function ($query) {
                                    $query->where('Status', Attendance::STATUS['HAVE_IN'])
                                        ->orWhere('Status', Attendance::STATUS['NOT_IN_CLASS'])
                                        ->orWhere('Status', Attendance::STATUS['UNPAID_LEAVE']);
                                })
                                ->first();

                            if (is_null($existAttendance)) {
                                $dataCheckOut = [
                                    'Date' => $date,
                                    'StudentId' => $student->Id,
                                    'Status' => Attendance::STATUS['HAVE_OUT'],
                                    'CheckOut' => $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s'),
                                    'IsHaveOutAi' => true
                                ];

                                $existAttendance = $this->model->create($dataCheckOut);
                            } else {
                                $existAttendance->update([
                                    'Status' => Attendance::STATUS['HAVE_OUT'],
                                    'CheckOut' => $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s'),
                                    'IsHaveOutAi' => true
                                ]);
                            }

                            AttendanceLog::create([
                                'AttendanceId' => $existAttendance->Id,
                                'Action' => 'Ra về',
                                'Type' => 'CAMERA_AI',
                                'FileImage' =>  $inOutAfterTimeStart[0]->FileImage
                            ]);

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
                            $images =  json_decode($student->FileImage);
                            $urlImage = '';

                            if (!empty($images)) {
                                $urlImage = env('IMAGE_URL') . $images[0];
                            }

                            $timeCheckOut = $inOutAfterTimeEnd[0]->AttendedAt->format('H:i:s');
                            $message = 'Bé' . ' ' . $nameStudent . ' ' . 'đã ra về lúc' . ' ' . $timeCheckOut;


                            if (!empty($userId)) {
                                $dataNoti = [
                                    'users' => $userId,
                                    'title' => $nameStudent,
                                    'imageURL' => $urlImage,
                                    'message' => $message,
                                    'moduleType' => 6,
                                    'moduleCode' => 'ATTENDANCE',
                                    'refId' => $student->Id,
                                ];

                                dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
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
                        $existAttendance = Attendance::where('StudentId', $student->Id)
                            ->whereDate('Date', $date)->first();

                        $dataCheckOut = [
                            'Date' => $date,
                            'StudentId' => $student->Id,
                            'Status' => Attendance::STATUS['UNPAID_LEAVE'],
                        ];

                        if (is_null($existAttendance)) {
                            $this->model->create($dataCheckOut);
                        } else {
                            $existAttendance->update($dataCheckOut);
                        }

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
                        $images =  json_decode($student->FileImage);
                        $urlImage = '';

                        if (!empty($images)) {
                            $urlImage = env('IMAGE_URL') . $images[0];
                        }

                        $message = 'Bé' . ' ' . $nameStudent . ' ' . 'vắng không phép ngày' . ' ' . $date;

                        if (!empty($userId)) {
                            $dataNoti = [
                                'users' => $userId,
                                'title' => $nameStudent,
                                'imageURL' => $urlImage,
                                'message' => $message,
                                'moduleType' => 6,
                                'moduleCode' => 'ATTENDANCE',
                                'refId' => $student->Id,
                            ];

                            dispatch(new \GGPHP\Core\Jobs\SendNoti($dataNoti));
                        }
                    }
                }
            }
        }
        return true;
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

        //$student->where('Status', '!=', Student::STORE);
        $student->where('Status', '=', Student::OFFICAL);

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
            //$student = Student::where('ClassId', $item->Id)->where('Status', '!=', Student::STORE)->get();
            $student = Student::where('ClassId', $item->Id)->where('Status', '=', Student::OFFICAL)->get();

            $attendanceHaveIn = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where(function ($query) {
                $query->where('Status', Attendance::STATUS['HAVE_IN']);
            })->count();
            $attendanceHaveOut = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where(function ($query) {
                $query->where('Status', Attendance::STATUS['HAVE_OUT']);
            })->count();

            $attendanceAnnualLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['ANNUAL_LEAVE'])->count();
            $attendanceUnpaidLeave = Attendance::where('Date', $attributes['date'])->whereIn('StudentId', $student->pluck('Id')->toArray())->where('Status', Attendance::STATUS['UNPAID_LEAVE'])->count();

            $item->report = [
                'totalStudent' => count($student),
                'haveIn' => $attendanceHaveIn,
                'haveOut' => $attendanceHaveOut,
                'annualLeave' => $attendanceAnnualLeave,
                'unpaidLeave' => $attendanceUnpaidLeave
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

    public function exportExcelAttendance($attributes)
    {
        $students = $this->getAttendance($attributes);

        $branch = null;
        if (!empty($attributes['branchId'])) {
            $branch = Branch::where('Id', $attributes['branchId'])->first();
        }

        $className = null;
        if (!empty($attributes['classId'])) {
            $className = Classes::where('Id', $attributes['classId'])->first();
        }

        $studentName = null;
        if (!empty($attributes['fullName'])) {
            $studentName = Student::where('FullName', $attributes['fullName'])->first();
        }

        $params['{month_name}'] = 'Tháng ' . Carbon::parse($attributes['startDate'])->format('m/Y');
        $params['{branch}'] = is_null($branch) ? '--Tất cả--' : $branch->Name;
        $params['{class_name}'] = is_null($className) ? '--Tất cả--' : $className->Name;
        $params['{student}'] = is_null($studentName) ? '--Tất cả--' : $studentName->FullName;
        $params['[number]'] = [];
        $params['[full_name]'] = [];
        $params['[class]'] = [];
        $params['{merge_have_in}'] = '';
        $params['{merge_have_out}'] = '';
        $params['{note}'] = '';
        $month = [];
        $init_value = [];

        $period = Carbon::create($attributes['startDate'])->daysUntil($attributes['endDate']);
        $period->setLocale('vi_VN');
        $params['[[date]]'][] = iterator_to_array($period->map(function (Carbon $date) use (&$init_value, &$month) {
            $check = Carbon::parse($date)->setTimezone('GMT+7')->format('l');

            $month[] = 'Tháng ' . $date->format('m');
            if ($check === 'Saturday' || $check === 'Sunday') {
                $init_value[$date->format('Y-m-d')] = ''; // cuối tuần
            } else {
                $init_value[$date->format('Y-m-d')] = '-';
            }

            return $date->format('d');
        }));
        $stt = 0;
        foreach ($students as $key => $student) {
            $stt += 1;
            $params['[number]'][] = $stt;
            $params['[full_name]'][] = $student->FullName;
            $params['[class]'][] = is_null($student->classStudent) ? '' : $student->classStudent->classes->Name;
            $values = $init_value;
            $quantityHaveIn = 0;
            $quantityUnpaidLeave = 0;
            $quantityAnnualLeave = 0;

            if (!empty($student->attendance)) {
                foreach ($student->attendance as $item) {
                    switch ($item->Status) {
                        case Attendance::STATUS['ANNUAL_LEAVE']:
                            $values[$item->Date->format('Y-m-d')] = 'F';
                            $quantityUnpaidLeave += 1;
                            break;
                        case Attendance::STATUS['UNPAID_LEAVE']:
                            $values[$item->Date->format('Y-m-d')] = 'K';
                            $quantityAnnualLeave += 1;
                            break;
                        case Attendance::STATUS['HAVE_IN']:
                            $values[$item->Date->format('Y-m-d')] = 'X';
                            $quantityHaveIn += 1;
                            break;
                    }
                }
            }

            $params['[[value]]'][] = array_values($values);
            $params['[have_in]'][] = $quantityHaveIn;
            $params['[unpaid_leave]'][] = $quantityUnpaidLeave;
            $params['[annual_leave]'][] = $quantityAnnualLeave;
        }

        $params['[[month]]'][] = array_values($month);
        $listMerge = [];
        $callbacks = [
            '[[month]]' => function (CallbackParam $param) use (&$listMerge) {
                $row_index = $param->row_index;

                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;

                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);

                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);

                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                if ($cell_coordinate == 'D7') {
                    $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);

                    for ($i = 0; $i < count($param->param[$row_index]); $i++) {
                        $adjustedColumnIndex = $columnIndex + $i;

                        if ($param->param[$row_index][$i] != $firstValue) {

                            $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex - 1);
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);

                            $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                            $firstValue = $param->param[$row_index][$i];
                        }

                        if ($i == count($param->param[$row_index]) - 1) {
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                        }
                    }
                }

                foreach ($mergeCoordinate as $key => $coordinate) {
                    if ($key % 2 != 0) {
                        $merge = $mergeCoordinate[$key - 1] . ':' . $mergeCoordinate[$key];
                        $listMerge[] = $merge;
                    }
                }
            },
            '[[value]]' => function (CallbackParam $param) use (&$listMerge, &$listRowTs) {
                $sheet = $param->sheet;
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $value = $param->param[$row_index][$col_index];

                if ($value == '') {
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('4285f4');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);
                }
            },
            '{merge_have_in}' => function (CallbackParam $param) use (&$listMerge) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $sheet->getColumnDimension($currentColumn)
                    ->setWidth(500);
                $currentRow = $currentRow + 1;
                $merge = $cell_coordinate . ':' . $currentColumn . $currentRow;
                $listMerge[] = $merge;
            },
            '{merge_have_out}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                $columnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($columnIndex + 1);
                $merge = $cell_coordinate . ':' . $columnBefor . $currentRow;
                $listMerge[] = $merge;
            },
            '{note}' => function (CallbackParam $param) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $lastCol = 'E' . $currentRow;
                $merge = $cell_coordinate . ':' . $lastCol;

                $sheet->mergeCells($merge);

                $sheet->getRowDimension($currentRow)->setRowHeight(80);
            },
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge) {
                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }
                $sheet->mergeCells('D5:E5');
                $sheet->mergeCells('G5:H5');
                $sheet->mergeCells('J5:K5');
                $sheet->mergeCells('M5:N5');
            },

        ];

        return $this->excelExporterServices->export('attendance_report', $params, $callbacks, $events);
    }
}
