<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Config\Models\Config;
use GGPHP\Division\Models\RankPositionInformation;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Presenters\TimekeepingPresenter;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Illuminate\Pagination\LengthAwarePaginator;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TimekeepingRepositoryEloquent extends BaseRepository implements TimekeepingRepository
{
    protected $employeeRepositoryEloquent, $employee, $quotaWork;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->employee = null;
        $this->quotaWork = null;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Timekeeping::class;
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
        return TimekeepingPresenter::class;
    }

    public function filterTimekeeping(array $attribute)
    {

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('type', $attribute['type']);
            }

            if (!empty($attribute['device_id'])) {
                $query->where('device_id', $attribute['device_id']);
            }
            if (!empty($attribute['start_date']) && !empty($attribute['end_date'])) {
                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            };
        })->with(['timekeeping' => function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('type', $attribute['type']);
            }

            if (!empty($attribute['device_id'])) {
                $query->where('device_id', $attribute['device_id']);
            }

            if (!empty($attribute['start_date']) && !empty($attribute['end_date'])) {
                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            };
        }]);

        if (!empty($attribute['EmployeeId'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('EmployeeId', explode(',', $attribute['EmployeeId']));
            });
        }

        $timekeeping = !empty($attribute['limit']) ? $this->employeeRepositoryEloquent->paginate($attribute['limit']) : $this->employeeRepositoryEloquent->get();

        return $timekeeping;
    }

    /**
     * @param $employeeId
     * @param $position
     * @param $store
     * @param $start_date
     * @param $end_date
     * @param $limit
     * @param bool $parser
     * @param $type
     * @param null $work_form_id
     * @param null $isFilter
     * @param null $rank
     * @return mixed
     */
    public function timekeepingReport($employeeId, $position, $store, $start_date, $end_date, $limit, $parser, $type = null, $work_form_id = null, $isFilter = null, $rank = null, $full_name = null, $is_shift = "true")
    {
        $employeesByStore = $this->employeeRepositoryEloquent->model()::with(['lateEarly' => function ($q) use ($start_date, $end_date) {
            $q->whereDate('date', '>=', $start_date)->whereDate('date', '<=', $end_date);
        }])->with(['addSubTime' => function ($query) use ($start_date, $end_date) {
            $query->whereHas('addSubTimeDetail', function ($q) use ($start_date, $end_date) {
                $q->where('start_date', '>=', $start_date);
                $q->where('end_date', '<=', $end_date);
            });
        }]);

        if ($is_shift === "true") {
            $employeesByStore->whereHas('schedules', function ($query) use ($start_date, $end_date) {
                $query->where([['start_date', '<=', $start_date], ['end_date', '>=', $end_date]])
                    ->orWhere([['start_date', '>', $start_date], ['start_date', '<=', $end_date]])
                    ->orWhere([['end_date', '>=', $start_date], ['end_date', '<', $end_date]]);
            });
        }

        if (!is_null($full_name)) {
            $employeesByStore->where('full_name', 'like', '%' . $full_name . '%');
        }

        $result = $employeesByStore->with(['timekeeping' => function ($query) use ($start_date, $end_date) {
            $query->whereDate('attended_at', '>=', Carbon::parse($start_date)->format('Y-m-d'))
                ->whereDate('attended_at', '<=', Carbon::parse($end_date)->format('Y-m-d'))
                ->orderBy('attended_at');
        }])->get();

        if ($employeeId) {

            $employeesArray = explode(',', $employeeId);

            $employees = $this->employeeRepositoryEloquent->model()::whereIn('id', $employeesArray)->with(['lateEarly' => function ($q) use ($start_date, $end_date) {
                $q->whereDate('date', '>=', Carbon::parse($start_date)->format('Y-m-d'))->whereDate('date', '<=', Carbon::parse($end_date)->format('Y-m-d'));
            }])->with(['addSubTime' => function ($query) use ($start_date, $end_date) {
                $query->with(['addSubTimeDetail' => function ($q) use ($start_date, $end_date) {
                    $q->where('start_date', '>=', $start_date);
                    $q->where('end_date', '<=', $end_date);
                }]);
            }]);

            if ($is_shift === "true") {
                $employees->whereHas('schedules', function ($query) use ($start_date, $end_date) {
                    $query->where([['start_date', '<=', $start_date], ['end_date', '>=', $end_date]])
                        ->orWhere([['start_date', '>', $start_date], ['start_date', '<=', $end_date]])
                        ->orWhere([['end_date', '>=', $start_date], ['end_date', '<', $end_date]]);
                });
            }

            $employees->with(['timekeeping' => function ($query) use ($start_date, $end_date) {
                $query->whereDate('attended_at', '>=', Carbon::parse($start_date)->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($end_date)->format('Y-m-d'))
                    ->orderBy('attended_at');
            }]);

            $employees = $employees->get();

            foreach ($employees as &$employee) {
                $result = $this->calculatorTimekeepingReport($employee, $start_date, $end_date, $type);
            }

            if ($type == $this->model()::MONTH) {
                return $employees;
            }

            $response = $limit == config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO') ? $employees : $this->paginateCollection($employees, $limit);

            if (!$parser || $type == $this->model()::MONTH) {
                return $employees;
            }

            return $this->employeeRepositoryEloquent->parserResult($response);
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorTimekeepingReport($employee, $start_date, $end_date, $type);
        }

        if (!$parser || $type == $this->model()::MONTH) {
            return $result;
        }

        $response = $limit == config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO') ? $result : $this->paginateCollection($result, $limit);

        return $this->employeeRepositoryEloquent->parserResult($response);
    }

    /**
     * Get timekeeping report
     * @param $employee
     * @param $start_date
     * @param $end_date
     * @param null $type
     * @return array
     */
    public function calculatorTimekeepingReport($employee, $start_date, $end_date, $type = null)
    {
        $this->employee = $employee;
        $storeRequest = request('store_id');
        $employeeTimekeeping = [];
        $result = [];
        $responseTimeKeepingUser = [];
        $totalRealTimekeeping = 0;
        $totalHourRedundantTimekeeping = 0;
        $timeKeepingByDate = [];
        $workHourRedundant = 0;
        $workBirthday = 0;
        $additionalTimes = 0;
        $additionalHours = 0;
        $subtractionTimes = 0;
        $subtractionHours = 0;
        // thoi gian cham cong
        $employeeHasTimekeeping = $employee->timekeeping;

        $addSubTime = $employee->addSubTime;

        if (count($addSubTime) > 0) {
            foreach ($addSubTime as $value) {
                $detail = $value->addSubTimeDetail;

                switch ($value->type) {
                    case 'ADD':
                        foreach ($detail as $value) {
                            $additionalTimes += $value->days;
                            $additionalHours += $value->hours;
                        }
                        break;
                    case 'SUB':
                        foreach ($detail as $value) {
                            $subtractionTimes += $value->days;
                            $subtractionHours += $value->hours;
                        }
                        break;
                }
            }
        }

        $employee->additionalTimes = $additionalTimes;
        $employee->additionalHours = $additionalHours > 0 ? gmdate("H:i", $additionalHours * 3600) : '00:00';
        $employee->subtractionTimes = $subtractionTimes;
        $employee->subtractionHours = $subtractionHours > 0 ? gmdate("H:i", $subtractionHours * 3600) : '00:00';

        // lateEarly
        $lateEarly = $employee->lateEarly;

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->id, $start_date, $end_date);

        $begin = new \DateTime($start_date);
        $end = new \DateTime($end_date);
        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        foreach ($periodDate as $key => $date) {
            if (!array_key_exists($date->format('Y-m-d'), $employeeTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    "date" => $date->format('Y-m-d'),
                    "timekeepingReport" => 0,
                    "type" => "KC",
                ];
            }
        }

        if (count($employeeHasTimekeeping) > 0) {
            $count = count($employeeTimeWorkShift);
            $i = 1;

            // get thoi gian cham cong theo ngay
            foreach ($employeeHasTimekeeping as $timekeeping) {
                $timeKeepingByDate[Carbon::parse($timekeeping->attended_at)->format('Y-m-d')][] = $timekeeping;
            }

            foreach ($employeeTimeWorkShift as $key => $value) {

                if (!empty($timeKeepingByDate[$key])) {

                    // TODO: check invalid timekeeping
                    $existInvalid = $lateEarly->filter(function ($item) use ($key) {
                        $dateInvalid = $item->date->format('Y-m-d');
                        return $dateInvalid == $key && $item->status == LateEarly::INVALID;
                    })->first();

                    $existAutoApproval = $lateEarly->filter(function ($item) use ($key) {
                        $dateAutoApproval = $item->date->format('Y-m-d');
                        return $dateAutoApproval == $key && $item->status == LateEarly::AUTOMATIC_APPROVE;
                    })->first();

                    $dataAutoApproval = [
                        'existAutoApproval' => $existAutoApproval,
                    ];

                    if (!empty($existInvalid) && Carbon::parse($existInvalid->date)->format('Y-m-d') == $key) {
                        $responseTimeKeepingUser[] = [
                            "date" => $key,
                            "timekeepingReport" => 0,
                            "type" => "KXD",
                        ];
                    } else {
                        $quotaWork = 8;
                        $this->quotaWork = 8;
                        // mac dinh lay tat ca cac ngay
                        $resultTimekeeping[$key] = $this->calculatorTimekeeping($quotaWork, $key, $value, $timeKeepingByDate[$key], $type, $dataAutoApproval);

                        $employee->reportTimkeepingPage = [$resultTimekeeping];
                        $result['date'] = $key;
                        $result['timekeepingReport'] = $resultTimekeeping[$key]['totalTimeKeeping'];
                        $result['type'] = null;

                        $responseTimeKeepingUser[] = $result;

                        if ($resultTimekeeping[$key]['totalTimeKeeping'] >= 1) {
                            $totalRealTimekeeping += $resultTimekeeping[$key]['totalTimeKeeping'];
                        } else {

                            $totalHourRedundantTimekeeping += $resultTimekeeping[$key]['totalTimeRedundant'];
                        }
                        $employee->totalRealTimekeeping = $totalRealTimekeeping;
                        $employee->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : 0;
                        $i++;

                    }

                }
            }

        }

        $employee->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : '00:00';
        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $start_date, $end_date, $responseTimeKeepingUser);
        $responseTimeKeepingUser = $this->getRecordRevokeShift($employee, $start_date, $end_date, $responseTimeKeepingUser);

        $quotaWork = $this->quotaWork;

        if ($quotaWork > 0) {
            $totalTimekeepingWork = 0;
            $totalHoursMinutesPartTime = 0;

            foreach ($responseTimeKeepingUser as &$item) {
                $totalTimekeepingWork += $item['timekeepingReport'];
                // format hour when type is part_time
                if ($type && ($type == $this->model()::PART_TIME || $type == 'PART_TIME_SECOND')) {
                    $item['timekeepingReport'] = gmdate("H:i", $item['timekeepingReport']);

                    list($hour, $minute) = explode(':', date('H:i', strtotime($item['timekeepingReport'])));
                    $totalHoursMinutesPartTime += $hour * 60;
                    $totalHoursMinutesPartTime += $minute;
                }
            }
            $employee->totalTimekeepingDate = $totalTimekeepingWork;
            // ngay cong thuc te, gio du sau khi chia
            if ($totalHourRedundantTimekeeping >= ($quotaWork * 3600)) {
                $hourSub = $totalHourRedundantTimekeeping / ($quotaWork * 3600);

                $hoursTemp = floor($hourSub) * $quotaWork;

                $employee->totalRealTimekeeping = $employee->totalRealTimekeeping + floor($hourSub);
                $hourRedundantAfterSub = $totalHourRedundantTimekeeping - ($hoursTemp * 3600);

            } else {
                $hourRedundantAfterSub = $totalHourRedundantTimekeeping;
            }

            $employee->totalHourRedundantTimekeeping = gmdate('H:i', $hourRedundantAfterSub);

            $totalTimekeepingWork = $totalTimekeepingWork >= 1 ? $totalTimekeepingWork : 0;

            // thuc cong
            $totalWorks = ($employee->totalRealTimekeeping + $employee->totalAnnualAbsent + $additionalTimes - $subtractionTimes) > 0
            ? $employee->totalRealTimekeeping + $employee->totalAnnualAbsent + $additionalTimes - $subtractionTimes
            : $totalTimekeepingWork;

            $totalHoursAdd = $additionalHours * 3600 + $hourRedundantAfterSub;

            $totalHoursSub = $subtractionHours * 3600;

            if ($totalHoursAdd >= $totalHoursSub) {
                $hourRedundant = $totalHoursAdd - $totalHoursSub;
            } else {
                $temp = $totalHoursSub - $totalHoursAdd;
                $a = $temp / ($quotaWork * 3600);
                $totalWorks = $totalWorks - $a;

                $hourRedundant = ($totalWorks - floor($totalWorks)) * ($quotaWork * 3600);
                $totalWorks = floor($totalWorks);

            }
            if ($hourRedundant > $quotaWork * 3600) {
                $hourSub = $hourRedundant / ($quotaWork * 3600);
                $hourRedundant = ($hourSub - floor($hourSub)) * 3600;
            };

            //sinh nhật employee
            $hourBirthday = 0;
            $workAddBrithday = 0;
            $workBirthday = 0;

            if (($type != $this->model()::PART_TIME && $type != 'PART_TIME_SECOND') && !is_null($employee->birthday)) {
                $yearStart = Carbon::parse($start_date)->format('Y');
                $yearEnd = Carbon::parse($end_date)->format('Y');

                $birthdayForYearStart = $employee->birthday->setYear($yearStart);

                $birthdayForYearEnd = $employee->birthday->setYear($yearEnd);

                $workTime = $employee->workTime;

                if (!is_null($workTime)) {

                    $today = Carbon::today();
                    $startWork = $workTime->start_date;
                    $seniority = $today->diffInMonths($startWork);
                    if ($seniority >= 1) {

                        $temp1 = $birthdayForYearStart->diffInMonths($startWork);
                        $temp2 = $birthdayForYearStart->diffInMonths($startWork);
                        if ($temp1 >= 1 || $temp2 >= 1) {

                            if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($start_date)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($end_date)->format('Y-m-d'))
                                || ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($start_date)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($end_date)->format('Y-m-d'))) {

                                $workBirthday = 1;
                                $workAddBrithday = 1;
                                if ($yearStart !== $yearEnd) {
                                    if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($start_date)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($end_date)->format('Y-m-d'))
                                        && ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($start_date)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($end_date)->format('Y-m-d'))) {
                                        $workBirthday = 2;
                                        $workAddBrithday = 2;
                                    }
                                }

                                foreach ($responseTimeKeepingUser as $value) {
                                    if ($value['date'] === $birthdayForYearStart->format('Y-m-d') || $value['date'] === $birthdayForYearEnd->format('Y-m-d')) {
                                        if ($value['timekeepingReport'] == 1) {
                                            $workBirthday += 1;
                                        } else {
                                            $hourBirthday += $quotaWork - ($value['timekeepingReport'] * $quotaWork);

                                            $workAddBrithday -= 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            $hourRedundant = ($hourBirthday * 3600) + $hourRedundant;

            if ($hourRedundant >= $quotaWork * 3600) {
                $hourSub = $hourRedundant / ($quotaWork * 3600);
                $hourRedundant = ($hourSub - floor($hourSub)) * 3600;
                $totalWorks = $totalWorks + floor($hourSub);
            }

            $totalWorks = $totalWorks + $workAddBrithday;

            $employee->totalWorks = $totalWorks;
            $employee->workBirthday = $workBirthday;
            $employee->totalHourRedundantWorks = $type == $this->model()::MONTH ? $hourRedundant : gmdate("H:i", $hourRedundant);
            $employee->totalHourRedundantWorksFormatDate = round($hourRedundant / ($quotaWork * 3600), 2);

            // la cham cong gio, format timekeeping report: H:i
            if ($type && ($type == $this->model()::PART_TIME || $type == 'PART_TIME_SECOND') && !empty($responseTimeKeepingUser)) {
                // sum hours minutes part time
                $totalHours = floor($totalHoursMinutesPartTime / 60);
                $totalHoursMinutesPartTime -= $totalHours * 60;
                $employee->totalRealTimekeeping = sprintf('%02d:%02d', $totalHours, $totalHoursMinutesPartTime);
            }

        }

        $employee->timeKeepingReport = $responseTimeKeepingUser;

        return $employee;
    }

    /**
     * @param $i
     * @param $count
     * @param $employee
     * @param $totalRealTimekeeping
     * @param $totalHourRedundantTimekeeping (DO NOT USE)
     */
    public function setAttributeForUser($i, $count, $employee, $totalRealTimekeeping, $totalHourRedundantTimekeeping)
    {
        if ($i == $count) {
            $employee->totalRealTimekeeping = $totalRealTimekeeping;
            $employee->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : 0;
        }
    }
    /**`
     * Get workshift by employee
     * @param $employeeHasWorkShift
     * @return mixed
     */
    public function getWorkShiftByUser($employeeHasWorkShift)
    {
        $employeeTimeWorkShift = [];
        foreach ($employeeHasWorkShift as $item) {
            foreach ($item->employee as $value) {
                $getWorkTimes = $value->pivot->shift_time;
                $workTimes = json_decode($getWorkTimes, true);

                $employeeTimeWorkShift[Carbon::parse($item->work_date)->format('Y-m-d')]['workShiftTimes'] = $workTimes;
            }
        }

        return $employeeTimeWorkShift;
    }

    /**
     * Calculator timekeeping
     * @param $quotaWork
     * @param $date
     * @param $value
     * @param $timeKeepingByDate
     * @param $type
     * @return array
     */
    public function calculatorTimekeeping($quotaWork, $date, $value, $timeKeepingByDate, $type, $dataAutoApproval)
    {
        $resultCalculator = 0;
        $totalShiftTime = 0;
        $totalBreakTime = 0;
        $resultCalculatorHours = 0;

        foreach ($value as $key => $item) {
            $totalShiftTime += strtotime($item['end_time']) - strtotime($item['start_time']);
            if (isset($value[$key]['start_time']) && isset($value[$key + 1]['end_time'])) {
                $totalBreakTime += strtotime($value[$key + 1]['start_time']) - strtotime($value[$key]['end_time']);
            }

            // cham cong họp le trong khoan 1h
            $employeeTracking = $this->ruleTimeAllow($date, $key, $timeKeepingByDate, $item);
            $employeeTrackingStartTime = isset($employeeTracking[$date][$key][Timekeeping::CHECK_IN])
            ? strtotime($employeeTracking[$date][$key][Timekeeping::CHECK_IN])
            : 0;
            $employeeTrackingEndTime = isset($employeeTracking[$date][$key][Timekeeping::CHECK_OUT])
            ? strtotime($employeeTracking[$date][$key][Timekeeping::CHECK_OUT])
            : 0;

            if ($employeeTrackingStartTime > 0 && $employeeTrackingEndTime > 0) {
                $workShiftStartTime = strtotime($item['start_time']);
                $workShiftEndTime = strtotime($item['end_time']);

                $attributeApplyRule = [
                    'totalShiftTime' => strtotime($item['end_time']) - strtotime($item['start_time']),
                    'workShiftStartTime' => $workShiftStartTime,
                    'workShiftEndTime' => $workShiftEndTime,
                    'employeeTrackingStartTime' => $employeeTrackingStartTime,
                    'employeeTrackingEndTime' => $employeeTrackingEndTime,
                    'timeSlot' => $item['start_time'] . '-' . $item['end_time'],
                ];

                $resultCalculator += $this->applyRule($attributeApplyRule, $date, $dataAutoApproval);
                $resultCalculatorHours += $employeeTrackingEndTime - $employeeTrackingStartTime;
            }
        }

        if ($type && $type == $this->model()::PART_TIME) {
            $result = ['totalTimeKeeping' => $resultCalculator, 'totalTimeRedundant' => 0];
        } elseif ($type && $type == 'PART_TIME_SECOND') {
            $result = ['totalTimeKeeping' => $resultCalculatorHours, 'totalTimeRedundant' => 0];
        } else {

            $response = $resultCalculator / ($quotaWork * 3600) > 1 ? 1 : ($resultCalculator / ($quotaWork * 3600));

            $totalTimeRedundant = $resultCalculator < ($quotaWork * 3600) ? $resultCalculator : 0;

            $result = ['totalTimeKeeping' => $response, 'totalTimeRedundant' => $totalTimeRedundant];
        }

        return $result;
    }

    /**
     * @param $date
     * @param $key
     * @param $timeKeepingByDate
     * @param $item
     * @return array
     */
    public function ruleTimeAllow($date, $key, $timeKeepingByDate, $item)
    {
        $formatHIS = config('constants.FORMAT_TIME.HIS');

        $employeeTracking = [];
        $employeeTracking[$date][$key][Timekeeping::CHECK_IN] = null;
        $employeeTracking[$date][$key][Timekeeping::CHECK_OUT] = null;

        $durationAllow[$date]['validTimeStart'] = $this->getDurationsAllow($date, $item['start_time'], Timekeeping::ALLOW_START_TIME, $key);
        $durationAllow[$date]['validTimeEnd'] = $this->getDurationsAllow($date, $item['end_time'], Timekeeping::ALLOW_END_TIME, $key);

        foreach ($timeKeepingByDate as $time) {

            if ($time->attended_at >= $durationAllow[$date]['validTimeStart'][0]
                && $time->attended_at <= $durationAllow[$date]['validTimeStart'][1]) {

                if (!($employeeTracking[$date][$key][Timekeeping::CHECK_IN])) {
                    $employeeTracking[$date][$key][Timekeeping::CHECK_IN]
                    = Carbon::parse($time->attended_at)->format($formatHIS);
                } elseif ($time->attended_at >= $durationAllow[$date]['validTimeEnd'][0]
                    && $time->attended_at <= $durationAllow[$date]['validTimeEnd'][1]) {
                    $employeeTracking[$date][$key][Timekeeping::CHECK_OUT] = Carbon::parse($time->attended_at)->format($formatHIS);
                }
            } elseif ($time->attended_at >= $durationAllow[$date]['validTimeEnd'][0]
                && $time->attended_at <= $durationAllow[$date]['validTimeEnd'][1]) {
                $employeeTracking[$date][$key][Timekeeping::CHECK_OUT] = Carbon::parse($time->attended_at)->format($formatHIS);
            }

        }

        return $employeeTracking;
    }

    /**
     * @param $attribute
     * @param $date
     * @return mixed
     */
    public function applyRule($attribute, $date, $dataAutoApproval)
    {
        $time = 0;
        if (!empty($attribute)) {

            $getConfigEarly = LateEarlyTimeConfig::where('type', LateEarlyTimeConfig::EARLY)->pluck('id')->toArray();
            $getConfigLate = LateEarlyTimeConfig::where('type', LateEarlyTimeConfig::LATE)->pluck('id')->toArray();

            $existLate = LateEarly::where('EmployeeId', $this->employee->id)
                ->whereDate('date', $date)
                ->whereIn('time_config_type', $getConfigLate)
                ->where('time_slot', $attribute['timeSlot'])
                ->first();

            $existEarly = LateEarly::where('EmployeeId', $this->employee->id)
                ->whereDate('date', $date)
                ->whereIn('time_config_type', $getConfigEarly)
                ->where('time_slot', $attribute['timeSlot'])
                ->first();

            $existAutoApproval = $dataAutoApproval['existAutoApproval'];

            // auto approval and early
            if (!empty($existAutoApproval) && !empty($existEarly)) {
                $time = strtotime(gmdate('H:i:s', $attribute['workShiftEndTime'] - strtotime($existEarly->time))) - $attribute['employeeTrackingStartTime'];
            } elseif (!empty($existAutoApproval)) {
                $time = $attribute['workShiftEndTime'] - $attribute['employeeTrackingStartTime'];
            }

            // ony late
            if (!empty($existLate) && empty($existEarly)) {
                // dd(1);
                $time = $attribute['workShiftEndTime'] - $attribute['employeeTrackingStartTime'];
            }

            // ony early
            if (empty($existLate) && !empty($existEarly)) {

                $time = strtotime(gmdate('H:i:s', $attribute['workShiftEndTime'] - strtotime($existEarly->time))) - $attribute['workShiftStartTime'];
            }

            // late && early
            if (!empty($existLate) && !empty($existEarly)) {

                $timeEarly = gmdate("H:i:s", $attribute['workShiftEndTime'] - strtotime($existEarly->time));
                $time = strtotime($timeEarly) - $attribute['employeeTrackingStartTime'];
            }

            if (empty($existLate) && empty($existEarly)) {
                $time = $attribute['totalShiftTime'];
            }

            $time = $time / 3600;
            $surplus = $time - floor($time);
            $timeTemp = 0;

            if ($surplus >= 0.5) {
                $timeTemp = (floor($time) + 0.5);
            } else {
                $timeTemp = (floor($time));
            }

            $time = $timeTemp * 3600;
        }

        return $time;
    }

    /**
     * @param $date
     * @param $valueWorkShift
     * @param $type
     * @return array
     */
    public function getDurationsAllow($date, $valueWorkShift, $type, $key)
    {
        $response = [];

        if ($key >= 1) {
            $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND')->first()->value;
        } else {
            $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME')->first()->value;
        }

        $minutesAfterStart = Config::where('code', 'DURATION_ALLOW_AFTERT_STARTTIME')->first()->value;
        $minutesBeforeEnd = Config::where('code', 'DURATION_ALLOW_BEFORE_ENDTIME')->first()->value;
        $minutesAfterEnd = Config::where('code', 'DURATION_ALLOW_AFTERT_ENDTIME')->first()->value;

        if ($type === Timekeeping::ALLOW_START_TIME) {
            $response[] = Carbon::parse($date . '' . $valueWorkShift)->subMinutes($minutesBeforeStart)->toDateTimeString();
            $response[] = Carbon::parse($date . '' . $valueWorkShift)->addMinutes($minutesAfterStart)->toDateTimeString();
        } elseif ($type === Timekeeping::ALLOW_END_TIME) {
            $response[] = Carbon::parse($date . '' . $valueWorkShift)->subMinutes($minutesBeforeEnd)->toDateTimeString();
            $response[] = Carbon::parse($date . '' . $valueWorkShift)->addMinutes($minutesAfterEnd)->toDateTimeString();
        }

        return $response;
    }

    /**
     * Convert hour to minutes
     * @param $time
     * @return float|int
     */
    public function hourToMinutes($time)
    {
        $timesplit = explode(':', $time);
        return ($timesplit[0] * 60) + ($timesplit[1]) + ($timesplit[2] > 30 ? 1 : 0);
    }

    /**
     * Calculator Absents
     * @param object $employee
     * @param string $start_date
     * @param string $end_date
     */
    public function calculatorAbsents(&$employee, $start_date, $end_date, $responseTimeKeepingUser)
    {
        $totalUnpaidAbsent = 0;
        $totalAnnualAbsent = 0;
        $totalOffAbsent = 0;

        $absentType = AbsentType::whereIn('type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE])->pluck('id')->toArray();
        $absentType2 = AbsentType::whereIn('type', [AbsentType::TYPE_OFF])->pluck('id')->toArray();

        $absents = $employee->absent()->whereIn('absent_type_id', $absentType)
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where([['start_date', '>=', $start_date], ['end_date', '<=', $end_date]])
                    ->orWhere([['start_date', '<=', $start_date], ['end_date', '>=', $start_date]])
                    ->orWhere([['start_date', '<=', $end_date], ['end_date', '>=', $end_date]]);
            })->get();

        $absents2 = $employee->absent()->whereIn('absent_type_id', $absentType2)
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where([['start_date', '>=', $start_date], ['end_date', '<=', $end_date]])
                    ->orWhere([['start_date', '<=', $start_date], ['end_date', '>=', $start_date]])
                    ->orWhere([['start_date', '<=', $end_date], ['end_date', '>=', $end_date]]);
            })->get();

        foreach ($absents as $absent) {

            $start = $start_date > $absent->start_date ? $start_date : $absent->start_date;
            $end = $end_date < $absent->end_date ? $end_date : $absent->end_date;

            $begin = new \DateTime($start);
            $end = new \DateTime($end . ' +1 day');
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            if ($absent->absentType->type == AbsentType::ANNUAL_LEAVE) {

                $totalAnnualAbsent += Carbon::parse($end)->diffInDays($start) + 1;
                // for report page
                $employee->annualAbsentForReport = Carbon::parse($start)->format('Y-m-d');

                foreach ($periodDate as $key => $date) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "NPN",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "NPN",
                        ];
                    }
                }
            }

            if ($absent->absentType->type == AbsentType::UNPAID_LEAVE) {

                $totalUnpaidAbsent += Carbon::parse($end)->diffInDays($start) + 1;
                foreach ($periodDate as $key => $date) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "NKL",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "NKL",
                        ];
                    }
                }
            }
        }

        foreach ($absents2 as $absent2) {

            $start = $start_date > $absent2->start_date ? $start_date : $absent2->start_date;
            $end = $end_date < $absent2->end_date ? $end_date : $absent2->end_date;

            $begin = new \DateTime($start);
            $end = new \DateTime($end . ' +1 day');
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            if ($absent2->absentType->type == AbsentType::TYPE_OFF) {
                $totalOffAbsent += 1;
                foreach ($periodDate as $key => $date) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "OFF",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "OFF",
                        ];
                    }
                }
            }
        }

        $employee->totalAnnualAbsent = $totalAnnualAbsent;
        $employee->totalUnpaidAbsent = $totalUnpaidAbsent;
        $employee->totalOffAbsent = $totalOffAbsent;

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator RevokeShift
     * @param object $employee
     * @param string $start_date
     * @param string $end_date
     */
    public function getRecordRevokeShift(&$employee, $start_date, $end_date, $responseTimeKeepingUser)
    {
        $revokeShifts = $employee->revokeShifts()
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where('date_violation', '>=', $start_date)->where('date_violation', '<=', $end_date);
            })->get();

        if (!empty(count($revokeShifts))) {
            foreach ($revokeShifts as $revokeShift) {

                $checkValue = array_search($revokeShift->date_violation, array_column($responseTimeKeepingUser, 'date'));

                if (!$checkValue) {
                    $responseTimeKeepingUser[] = [
                        "date" => $revokeShift->date_violation->format('Y-m-d'),
                        "timekeepingReport" => 0,
                        "type" => "BC",
                    ];
                }
            }
        }

        return $responseTimeKeepingUser;
    }

    /**
     * Paginate for collection
     * @param $object
     * @param $limit
     * @return LengthAwarePaginator
     */
    public function paginateCollection($object, $limit)
    {
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentPageItems = $object->slice(($currentPage * $limit) - $limit, $limit)->all();
        $items = new LengthAwarePaginator($currentPageItems, count($object), $limit);
        $items->setPath(request()->url());
        return $items;
    }

    /**
     * @param $request
     * @return object
     * @throws \Exception
     */
    public function export($request, $results = [])
    {
        if ($request->type != Timekeeping::MONTH) {
            $results = $this->timekeepingReport($request->EmployeeId, $request->PositionId, $request->store_id, $request->start_date, $request->end_date, $request->limit, false, $request->type, $request->work_form_id, $request->is_filter, null, $request->full_name, $request->is_shift);
        }

        switch ($request->type) {
            case Timekeeping::PART_TIME:
                extract($this->timekeepingReportByHourExporter($request, $results));
                break;
            case 'PART_TIME_SECOND':
                extract($this->timekeepingReportByHourExporter($request, $results));
                break;

            case Timekeeping::MONTH:
                extract($this->timekeepingReportByMonthExporter($request, $results));
                break;

            default:
                extract($this->timekeepingReportExporter($request, $results));
                break;
        }

        return $this->excelExporterServices->export($exportType, $params);
    }

    /**
     * @param $request
     * @param $results
     * @return array
     */
    public function timekeepingReportExporter($request, $results)
    {
        $params = [];
        $params['{start_date}'] = Carbon::parse($request->start_date)->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($request->end_date)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[employeeName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[totalWorkdays]'] = [];
        $params['[totalHourRedundantTimekeeping]'] = [];
        $params['[hourIncrease]'] = [];
        $params['[hourOvertime]'] = [];
        $params['[workOverTime]'] = [];
        $params['[workHourRedundant]'] = [];
        $params['[totalAnnualAbsent]'] = [];
        $params['[totalUnpaidAbsent]'] = [];
        $params['[totalAdditionalTimes]'] = [];
        $params['[totalAdditionalHours]'] = [];
        $params['[totalSubtractionTimes]'] = [];
        $params['[totalSubtractionHours]'] = [];
        $params['[realWorks]'] = [];
        $params['[hourRedundant]'] = [];
        $params['[workBirthday]'] = [];

        foreach ($results as $key => $employee) {
            $params['[number]'][] = ++$key;
            $params['[employeeName]'][] = $employee->full_name;
            $params['[store]'][] = !empty($employee->rankPositionInformation->store) ? $employee->rankPositionInformation->store->name : '';
            $params['[position]'][] = !empty($employee->rankPositionInformation->position) ? $employee->rankPositionInformation->position->name : '';
            $params['[work_forms]'][] = !empty($employee->rankPositionInformation->workForm) ? $employee->rankPositionInformation->workForm->name : '';
            $params['[totalWorkdays]'][] = !empty($employee->totalRealTimekeeping) ? $employee->totalRealTimekeeping : '';
            $params['[totalHourRedundantTimekeeping]'][] = !empty($employee->totalHourRedundantTimekeeping) ? $employee->totalHourRedundantTimekeeping : '';
            $params['[hourIncrease]'][] = !empty($employee->hourIncrease) ? $employee->hourIncrease : '';
            $params['[hourOvertime]'][] = !empty($employee->hourOvertime) ? $employee->hourOvertime : '';
            $params['[workOverTime]'][] = !empty($employee->workOverTime) ? $employee->workOverTime : '';
            $params['[workHourRedundant]'][] = !empty($employee->workHourRedundant) ? $employee->workHourRedundant : '';
            $params['[totalAnnualAbsent]'][] = !empty($employee->totalAnnualAbsent) ? $employee->totalAnnualAbsent : '';
            $params['[totalUnpaidAbsent]'][] = !empty($employee->totalUnpaidAbsent) ? $employee->totalUnpaidAbsent : '';
            $params['[totalAbsentOff]'][] = !empty($employee->totalOffAbsent) ? $employee->totalOffAbsent : '';
            $params['[totalAdditionalTimes]'][] = !empty($employee->additionalTimes) ? $employee->additionalTimes : '';
            $params['[totalAdditionalHours]'][] = !empty($employee->additionalHours) ? $employee->additionalHours : '';
            $params['[totalSubtractionTimes]'][] = !empty($employee->subtractionTimes) ? $employee->subtractionTimes : '';
            $params['[totalSubtractionHours]'][] = !empty($employee->subtractionHours) ? $employee->subtractionHours : '';
            $params['[realWorks]'][] = !empty($employee->totalWorks) ? round($employee->totalWorks, 2) : '';
            $params['[hourRedundant]'][] = !empty($employee->totalHourRedundantWorks) ? $employee->totalHourRedundantWorks : '';
            $params['[workBirthday]'][] = !empty($employee->workBirthday) ? $employee->workBirthday : '';
            $params['[workDeclaration]'][] = !empty($employee->totalWorkDeclarations) ? $employee->totalWorkDeclarations : '';
        }

        return [
            'params' => $params,
            'exportType' => 'timekeepingReport',
        ];
    }

    /**
     * @param $request
     * @param $results
     * @return array
     */
    public function timekeepingReportByHourExporter($request, $results)
    {
        $params = [];
        $params['{start_date}'] = Carbon::parse($request->start_date)->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($request->end_date)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[employeeName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[workForm]'] = [];
        $params['[sum]'] = [];
        $init_hours = [];

        $period = Carbon::create($request->start_date)->daysUntil($request->end_date);
        $period->setLocale('vi_VN');
        $params['[[date]]'][] = iterator_to_array($period->map(function (Carbon $date) use (&$init_hours) {
            $init_hours[$date->format('Y-m-d')] = '';
            return ucfirst($date->translatedFormat('l d-m-Y'));
        }));

        foreach ($results as $key => $employee) {
            $params['[number]'][] = ++$key;
            $params['[employeeName]'][] = $employee->full_name;
            $params['[store]'][] = $employee->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $employee->rankPositionInformation->position->name ?? '';
            $params['[workForm]'][] = $employee->rankPositionInformation->workForm->name ?? '';
            $hours = $init_hours;

            if (!empty($employee->timeKeepingReport)) {

                foreach ($employee->timeKeepingReport as $item) {

                    $hours[$item['date']] = $item['timekeepingReport'];

                }
            }

            $params['[[hours]]'][] = array_values($hours);

            $params['[sum]'][] = $employee->totalRealTimekeeping;
        }

        return [
            'params' => $params,
            'exportType' => 'timekeepingReportByHour',
        ];
    }

    /**
     * @param $request
     * @param $results
     * @return array
     */
    public function timekeepingReportByMonthExporter($request, $results)
    {
        $params = [];
        $params['{year}'] = $request->year;
        $params['[number]'] = [];
        $params['[employeeName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[workForm]'] = [];
        $params['[totalTimekeeping]'] = [];
        $params['[totalHour]'] = [];

        foreach ($results as $key => $employee) {
            $params['[number]'][] = ++$key;
            $params['[employeeName]'][] = $employee->full_name;
            $params['[store]'][] = $employee->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $employee->rankPositionInformation->position->name ?? '';
            $params['[workForm]'][] = $employee->rankPositionInformation->workForm->name ?? '';
            $params['[totalTimekeeping]'][] = $employee->totalTimekeepingByMonth ?? '';
            $params['[totalHour]'][] = $employee->totalHourRedundantByMonth ?? '';

            if (!empty($employee->timeKeepingReport)) {
                $month = 1;
                foreach ($employee->timeKeepingReport as $key => $item) {
                    $params['[totalTimekeeping_' . $month . ']'][] = $item['timekeepingMonth'];
                    $params['[totalHour_' . $month++ . ']'][] = $item['hourRedundantMonth'];
                }
            }
        }

        return [
            'params' => $params,
            'exportType' => 'timekeepingReportByMonth',
        ];
    }

    public function exportTimekeepingHistory($attribute)
    {
        $params = [];
        $result = [];
        $query = $this->employeeRepositoryEloquent->model->query();

        if (!empty($attribute['start_date']) && !empty($attribute['end_date'])) {
            $params['{start_date}'] = Carbon::parse($attribute['start_date'])->format('d-m-Y');
            $params['{end_date}'] = Carbon::parse($attribute['end_date'])->format('d-m-Y');

            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['device_id'])) {
                    $query->where('device_id', $attribute['device_id']);
                }

                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            })->with(['timekeeping' => function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['device_id'])) {
                    $query->where('device_id', $attribute['device_id']);
                }

                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            }]);
        }

        if (!empty($attribute['EmployeeId'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('EmployeeId', explode(',', $attribute['EmployeeId']));
            });
        }

        if (!empty($attribute['type'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('type', $attribute['type']);
            });
        }

        if (!empty($attribute['device_id'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('device_id', $attribute['device_id']);
            });
        }

        $query->where('status', 'ON');
        $query->orderBy('id', 'desc');
        $data = $query->get();

        foreach ($data as $key => $employee) {
            $detail = null;
            $number = null;

            foreach ($employee->timekeeping as $timekeeping) {
                $drive = $timekeeping->fingerprintTimekeeper->name;
                $dateTime = $timekeeping->attended_at->format('Y-m-d H:m:s');
                $detail .= "$drive -  $dateTime \n";
            }

            $result[] = [
                'stt' => ++$key,
                'full_name' => $employee->full_name,
                'store' => $employee->rankPositionInformation->store->name ?? '',
                'position' => $employee->rankPositionInformation->position->name ?? '',
                'number' => $employee->timekeeping->count(),
                'detail' => $detail,
            ];
        }

        foreach ($result as $value) {
            $params['[stt]'][] = $value['stt'];
            $params['[full_name]'][] = $value['full_name'];
            $params['[store]'][] = $value['store'];
            $params['[position]'][] = $value['position'];
            $params['[number]'][] = $value['number'];
            $params['[detail]'][] = $value['detail'];
        }

        return $this->excelExporterServices->export('timekeeping_history', $params);
    }

    public function exportTimekeepingHistory2($attribute)
    {
        $params = [];
        $result = [];
        $query = $this->employeeRepositoryEloquent->model->query();

        if (!empty($attribute['start_date']) && !empty($attribute['end_date'])) {
            $params['{start_date}'] = Carbon::parse($attribute['start_date'])->format('d-m-Y');
            $params['{end_date}'] = Carbon::parse($attribute['end_date'])->format('d-m-Y');

            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['device_id'])) {
                    $query->where('device_id', $attribute['device_id']);
                }

                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            })->with(['timekeeping' => function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['device_id'])) {
                    $query->where('device_id', $attribute['device_id']);
                }

                $query->whereDate('attended_at', '>=', Carbon::parse($attribute['start_date'])->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($attribute['end_date'])->format('Y-m-d'));
            }]);
        }

        if (!empty($attribute['EmployeeId'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('EmployeeId', explode(',', $attribute['EmployeeId']));
            });
        }

        if (!empty($attribute['type'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('type', $attribute['type']);
            });
        }

        if (!empty($attribute['device_id'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('device_id', $attribute['device_id']);
            });
        }

        $query->where('status', 'ON');

        $query->orderBy('id', 'desc');
        $data = $query->get();

        foreach ($data as $key => $employee) {
            $detail = null;
            $number = null;

            $result[] = [
                'stt' => ++$key,
                'full_name' => $employee->full_name,
                'store' => $employee->rankPositionInformation->store->name ?? '',
                'position' => $employee->rankPositionInformation->position->name ?? '',
                'shift' => '',
                'number' => $employee->timekeeping->count(),
                'detail' => '',
            ];

            $dataUser = [];
            foreach ($employee->timekeeping as $timekeeping) {
                $date = $timekeeping->attended_at->format('Y-m-d');

                if (!array_key_exists($date, $dataUser)) {
                    $drive = $timekeeping->fingerprintTimekeeper->name;
                    $dateTime = $timekeeping->attended_at->format('Y-m-d H:m:s');
                    $shift = '';

                    $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->id, $date, $date);

                    if (!empty($employeeHasWorkShift)) {
                        $countItemShift = count($employeeHasWorkShift[$date]);

                        if ($countItemShift == 1) {
                            $shiftCode = $employeeHasWorkShift[$date][0]['shift_code'];
                            $timeStart = $employeeHasWorkShift[$date][0]['start_time'];
                            $timeEnd = $employeeHasWorkShift[$date][0]['end_time'];
                            $timeShift = "$timeStart - $timeEnd";
                            $shift = "$shiftCode \n($timeShift)";
                        } else {
                            $shiftCode = $employeeHasWorkShift[$date][0]['shift_code'];

                            for ($i = 0; $i < $countItemShift; $i++) {
                                $timeStart = $employeeHasWorkShift[$date][$i]['start_time'];
                                $timeEnd = $employeeHasWorkShift[$date][$i]['end_time'];
                                $timeShift = "$timeStart - $timeEnd";

                                if ($i == 0) {
                                    $shift .= "$shiftCode \n ($timeShift \n";
                                } elseif ($i = $countItemShift) {
                                    $shift .= "$timeShift)";
                                } else {
                                    $shift .= "$timeShift";
                                }
                            }
                        }
                    }

                    $dataUser[$date] = [
                        'stt' => '',
                        'full_name' => $date,
                        'store' => '',
                        'position' => '',
                        'shift' => $shift,
                        'number' => 1,
                        'detail' => "$drive -  $dateTime \n",
                    ];
                } else {
                    $drive = $timekeeping->fingerprintTimekeeper->name;
                    $dateTime = $timekeeping->attended_at->format('Y-m-d H:m:s');
                    $dataUser[$date]['number'] += 1;
                    $dataUser[$date]['detail'] .= "$drive -  $dateTime \n";
                }
            }

            foreach ($dataUser as $value) {
                $result[] = $value;
            }
        }

        foreach ($result as $value) {
            $params['[stt]'][] = $value['stt'];
            $params['[full_name]'][] = $value['full_name'];
            $params['[store]'][] = $value['store'];
            $params['[position]'][] = $value['position'];
            $params['[shift]'][] = $value['shift'];
            $params['[number]'][] = $value['number'];
            $params['[detail]'][] = $value['detail'];
        }

        return $this->excelExporterServices->export('timekeeping_history2', $params);
    }
}
