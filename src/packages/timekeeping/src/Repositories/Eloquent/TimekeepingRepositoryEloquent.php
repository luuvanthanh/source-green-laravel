<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Config\Models\Config;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
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

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TimekeepingRepositoryEloquent extends CoreRepositoryEloquent implements TimekeepingRepository
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
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['deviceId'])) {
                $query->where('DeviceId', $attribute['deviceId']);
            }
            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            };
        })->with(['timekeeping' => function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['deviceId'])) {
                $query->where('DeviceId', $attribute['deviceId']);
            }

            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
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
     * @param $StartDate
     * @param $EndDate
     * @param $limit
     * @param bool $parser
     * @param $type
     * @param null $work_form_id
     * @param null $isFilter
     * @param null $rank
     * @return mixed
     */
    public function timekeepingReport($employeeId, $position, $store, $StartDate, $EndDate, $limit, $parser, $type = null, $work_form_id = null, $isFilter = null, $rank = null, $full_name = null, $is_shift = "true")
    {
        $employeesByStore = $this->employeeRepositoryEloquent->model()::with(['lateEarly' => function ($q) use ($StartDate, $EndDate) {
            $q->whereDate('Date', '>=', $StartDate)->whereDate('Date', '<=', $EndDate);
        }])->with(['addSubTime' => function ($query) use ($StartDate, $EndDate) {
            $query->whereHas('addSubTimeDetail', function ($q) use ($StartDate, $EndDate) {
                $q->where('StartDate', '>=', $StartDate);
                $q->where('EndDate', '<=', $EndDate);
            });
        }]);

        if ($is_shift === "true") {
            $employeesByStore->whereHas('schedules', function ($query) use ($StartDate, $EndDate) {
                $query->where([['StartDate', '<=', $StartDate], ['EndDate', '>=', $EndDate]])
                    ->orWhere([['StartDate', '>', $StartDate], ['StartDate', '<=', $EndDate]])
                    ->orWhere([['EndDate', '>=', $StartDate], ['EndDate', '<', $EndDate]]);
            });
        }

        if (!is_null($full_name)) {
            $employeesByStore->where('FullName', 'like', '%' . $full_name . '%');
        }

        $result = $employeesByStore->with(['timekeeping' => function ($query) use ($StartDate, $EndDate) {
            $query->whereDate('AttendedAt', '>=', Carbon::parse($StartDate)->format('Y-m-d'))
                ->whereDate('AttendedAt', '<=', Carbon::parse($EndDate)->format('Y-m-d'))
                ->orderBy('AttendedAt');
        }])->get();

        if ($employeeId) {

            $employeesArray = explode(',', $employeeId);

            $employees = $this->employeeRepositoryEloquent->model()::whereIn('Id', $employeesArray)->with(['lateEarly' => function ($q) use ($StartDate, $EndDate) {
                $q->whereDate('Date', '>=', Carbon::parse($StartDate)->format('Y-m-d'))->whereDate('Date', '<=', Carbon::parse($EndDate)->format('Y-m-d'));
            }])->with(['addSubTime' => function ($query) use ($StartDate, $EndDate) {
                $query->with(['addSubTimeDetail' => function ($q) use ($StartDate, $EndDate) {
                    $q->where('StartDate', '>=', $StartDate);
                    $q->where('EndDate', '<=', $EndDate);
                }]);
            }]);

            if ($is_shift === "true") {
                $employees->whereHas('schedules', function ($query) use ($StartDate, $EndDate) {
                    $query->where([['StartDate', '<=', $StartDate], ['EndDate', '>=', $EndDate]])
                        ->orWhere([['StartDate', '>', $StartDate], ['StartDate', '<=', $EndDate]])
                        ->orWhere([['EndDate', '>=', $StartDate], ['EndDate', '<', $EndDate]]);
                });
            }

            $employees->with(['timekeeping' => function ($query) use ($StartDate, $EndDate) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($StartDate)->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($EndDate)->format('Y-m-d'))
                    ->orderBy('AttendedAt');
            }]);

            $employees = $employees->get();

            foreach ($employees as &$employee) {
                $result = $this->calculatorTimekeepingReport($employee, $StartDate, $EndDate, $type);
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
            $employee = $this->calculatorTimekeepingReport($employee, $StartDate, $EndDate, $type);
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
     * @param $StartDate
     * @param $EndDate
     * @param null $type
     * @return array
     */
    public function calculatorTimekeepingReport($employee, $StartDate, $EndDate, $type = null)
    {
        $this->employee = $employee;
        $storeRequest = request('store_id');
        $employeeTimekeeping = [];
        $result = [];
        $responseTimeKeepingUser = [];
        $TotalRealTimekeeping = 0;
        $TotalHourRedundantTimekeeping = 0;
        $timeKeepingByDate = [];
        $WorkHourRedundant = 0;
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

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $StartDate, $EndDate);

        $begin = new \DateTime($StartDate);
        $end = new \DateTime($EndDate);
        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        foreach ($periodDate as $key => $date) {
            if (!array_key_exists($date->format('Y-m-d'), $employeeTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    "Date" => $date->format('Y-m-d'),
                    "TimekeepingReport" => 0,
                    "Type" => "KC",
                ];
            }
        }

        if (count($employeeHasTimekeeping) > 0) {
            $count = count($employeeTimeWorkShift);
            $i = 1;

            // get thoi gian cham cong theo ngay
            foreach ($employeeHasTimekeeping as $timekeeping) {
                $timeKeepingByDate[Carbon::parse($timekeeping->AttendedAt)->format('Y-m-d')][] = $timekeeping;
            }

            foreach ($employeeTimeWorkShift as $key => $value) {

                if (!empty($timeKeepingByDate[$key])) {

                    // TODO: check invalid timekeeping
                    $existInvalid = $lateEarly->filter(function ($item) use ($key) {
                        $dateInvalid = $item->Date->format('Y-m-d');
                        return $dateInvalid == $key && $item->Status == LateEarly::INVALID;
                    })->first();

                    $existAutoApproval = $lateEarly->filter(function ($item) use ($key) {
                        $dateAutoApproval = $item->Date->format('Y-m-d');
                        return $dateAutoApproval == $key && $item->Status == LateEarly::AUTOMATIC_APPROVE;
                    })->first();

                    $dataAutoApproval = [
                        'existAutoApproval' => $existAutoApproval,
                    ];

                    if (!empty($existInvalid) && Carbon::parse($existInvalid->Date)->format('Y-m-d') == $key) {
                        $responseTimeKeepingUser[] = [
                            "Date" => $key,
                            "TimekeepingReport" => 0,
                            "Type" => "KXD",
                        ];
                    } else {
                        $quotaWork = 8;
                        $this->quotaWork = 8;
                        // mac dinh lay tat ca cac ngay
                        $resultTimekeeping[$key] = $this->calculatorTimekeeping($quotaWork, $key, $value, $timeKeepingByDate[$key], $type, $dataAutoApproval);

                        $employee->reportTimkeepingPage = [$resultTimekeeping];
                        $result['Date'] = $key;
                        $result['TimekeepingReport'] = $resultTimekeeping[$key]['TotalTimeKeeping'];
                        $result['Type'] = null;

                        $responseTimeKeepingUser[] = $result;

                        if ($resultTimekeeping[$key]['TotalTimeKeeping'] >= 1) {
                            $TotalRealTimekeeping += $resultTimekeeping[$key]['TotalTimeKeeping'];
                        } else {
                            $TotalHourRedundantTimekeeping += $resultTimekeeping[$key]['TotalTimeRedundant'];
                        }

                        $employee->TotalRealTimekeeping = $TotalRealTimekeeping;
                        $employee->TotalHourRedundantTimekeeping = $TotalHourRedundantTimekeeping > 0 ? gmdate("H:i", $TotalHourRedundantTimekeeping) : 0;
                        $i++;

                    }

                }
            }

        }

        $employee->TotalHourRedundantTimekeeping = $TotalHourRedundantTimekeeping > 0 ? gmdate("H:i", $TotalHourRedundantTimekeeping) : '00:00';
        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $StartDate, $EndDate, $responseTimeKeepingUser);
        $responseTimeKeepingUser = $this->getRecordRevokeShift($employee, $StartDate, $EndDate, $responseTimeKeepingUser);

        $quotaWork = $this->quotaWork;

        if ($quotaWork > 0) {
            $totalTimekeepingWork = 0;
            $totalHoursMinutesPartTime = 0;

            foreach ($responseTimeKeepingUser as &$item) {
                $totalTimekeepingWork += $item['TimekeepingReport'];
                // format hour when type is part_time
                if ($type && ($type == $this->model()::PART_TIME || $type == 'PART_TIME_SECOND')) {
                    $item['TimekeepingReport'] = gmdate("H:i", $item['TimekeepingReport']);

                    list($hour, $minute) = explode(':', date('H:i', strtotime($item['TimekeepingReport'])));
                    $totalHoursMinutesPartTime += $hour * 60;
                    $totalHoursMinutesPartTime += $minute;
                }
            }
            $employee->TotalTimekeepingDate = $totalTimekeepingWork;

            // ngay cong thuc te, gio du sau khi chia
            if ($TotalHourRedundantTimekeeping >= ($quotaWork * 3600)) {
                $hourSub = $TotalHourRedundantTimekeeping / ($quotaWork * 3600);
                $hoursTemp = floor($hourSub) * $quotaWork;
                $employee->TotalRealTimekeeping = $employee->TotalRealTimekeeping + floor($hourSub);
                $hourRedundantAfterSub = $TotalHourRedundantTimekeeping - ($hoursTemp * 3600);
            } else {
                $hourRedundantAfterSub = $TotalHourRedundantTimekeeping;
            }

            $employee->TotalHourRedundantTimekeeping = gmdate('H:i', $hourRedundantAfterSub);

            $totalTimekeepingWork = $totalTimekeepingWork >= 1 ? $totalTimekeepingWork : 0;

            // thuc cong
            $totalWorks = ($employee->TotalRealTimekeeping + $employee->TotalAnnualAbsent + $additionalTimes - $subtractionTimes) > 0
            ? $employee->TotalRealTimekeeping + $employee->TotalAnnualAbsent + $additionalTimes - $subtractionTimes
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
                $yearStart = Carbon::parse($StartDate)->format('Y');
                $yearEnd = Carbon::parse($EndDate)->format('Y');

                $birthdayForYearStart = $employee->birthday->setYear($yearStart);

                $birthdayForYearEnd = $employee->birthday->setYear($yearEnd);

                $workTime = $employee->workTime;

                if (!is_null($workTime)) {

                    $today = Carbon::today();
                    $startWork = $workTime->StartDate;
                    $seniority = $today->diffInMonths($startWork);
                    if ($seniority >= 1) {

                        $temp1 = $birthdayForYearStart->diffInMonths($startWork);
                        $temp2 = $birthdayForYearStart->diffInMonths($startWork);
                        if ($temp1 >= 1 || $temp2 >= 1) {

                            if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($StartDate)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($EndDate)->format('Y-m-d'))
                                || ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($StartDate)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($EndDate)->format('Y-m-d'))) {

                                $workBirthday = 1;
                                $workAddBrithday = 1;
                                if ($yearStart !== $yearEnd) {
                                    if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($StartDate)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($EndDate)->format('Y-m-d'))
                                        && ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($StartDate)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($EndDate)->format('Y-m-d'))) {
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
                $employee->TotalRealTimekeeping = sprintf('%02d:%02d', $totalHours, $totalHoursMinutesPartTime);
            }

        }

        $employee->timeKeepingReport = $responseTimeKeepingUser;

        return $employee;
    }

    /**
     * @param $i
     * @param $count
     * @param $employee
     * @param $TotalRealTimekeeping
     * @param $TotalHourRedundantTimekeeping (DO NOT USE)
     */
    public function setAttributeForUser($i, $count, $employee, $TotalRealTimekeeping, $TotalHourRedundantTimekeeping)
    {
        if ($i == $count) {
            $employee->TotalRealTimekeeping = $TotalRealTimekeeping;
            $employee->TotalHourRedundantTimekeeping = $TotalHourRedundantTimekeeping > 0 ? gmdate("H:i", $TotalHourRedundantTimekeeping) : 0;
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
            $result = ['TotalTimeKeeping' => $resultCalculator, 'TotalTimeRedundant' => 0];
        } elseif ($type && $type == 'PART_TIME_SECOND') {
            $result = ['TotalTimeKeeping' => $resultCalculatorHours, 'TotalTimeRedundant' => 0];
        } else {

            $response = $resultCalculator / ($quotaWork * 3600) > 1 ? 1 : ($resultCalculator / ($quotaWork * 3600));

            $totalTimeRedundant = $resultCalculator < ($quotaWork * 3600) ? $resultCalculator : 0;

            $result = ['TotalTimeKeeping' => $response, 'TotalTimeRedundant' => $totalTimeRedundant];
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

            if ($time->AttendedAt >= $durationAllow[$date]['validTimeStart'][0]
                && $time->AttendedAt <= $durationAllow[$date]['validTimeStart'][1]) {

                if (!($employeeTracking[$date][$key][Timekeeping::CHECK_IN])) {
                    $employeeTracking[$date][$key][Timekeeping::CHECK_IN]
                    = Carbon::parse($time->AttendedAt)->format($formatHIS);
                } elseif ($time->AttendedAt >= $durationAllow[$date]['validTimeEnd'][0]
                    && $time->AttendedAt <= $durationAllow[$date]['validTimeEnd'][1]) {
                    $employeeTracking[$date][$key][Timekeeping::CHECK_OUT] = Carbon::parse($time->AttendedAt)->format($formatHIS);
                }
            } elseif ($time->AttendedAt >= $durationAllow[$date]['validTimeEnd'][0]
                && $time->AttendedAt <= $durationAllow[$date]['validTimeEnd'][1]) {
                $employeeTracking[$date][$key][Timekeeping::CHECK_OUT] = Carbon::parse($time->AttendedAt)->format($formatHIS);
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

            $getConfigEarly = LateEarlyTimeConfig::where('Type', LateEarlyTimeConfig::EARLY)->pluck('Id')->toArray();
            $getConfigLate = LateEarlyTimeConfig::where('Type', LateEarlyTimeConfig::LATE)->pluck('Id')->toArray();

            $existLate = LateEarly::where('EmployeeId', $this->employee->Id)
                ->whereDate('Date', $date)
                ->whereIn('TimeConfigType', $getConfigLate)
                ->where('TimeSlot', $attribute['timeSlot'])
                ->first();

            $existEarly = LateEarly::where('EmployeeId', $this->employee->Id)
                ->whereDate('Date', $date)
                ->whereIn('TimeConfigType', $getConfigEarly)
                ->where('TimeSlot', $attribute['timeSlot'])
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
            $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND')->first()->Value;
        } else {
            $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME')->first()->Value;
        }

        $minutesAfterStart = Config::where('code', 'DURATION_ALLOW_AFTERT_STARTTIME')->first()->Value;
        $minutesBeforeEnd = Config::where('code', 'DURATION_ALLOW_BEFORE_ENDTIME')->first()->Value;
        $minutesAfterEnd = Config::where('code', 'DURATION_ALLOW_AFTERT_ENDTIME')->first()->Value;

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
     * @param string $StartDate
     * @param string $EndDate
     */
    public function calculatorAbsents(&$employee, $StartDate, $EndDate, $responseTimeKeepingUser)
    {
        $totalUnpaidAbsent = 0;
        $TotalAnnualAbsent = 0;
        $totalOffAbsent = 0;

        $absentType = AbsentType::whereIn('Type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE])->pluck('Id')->toArray();
        $absentType2 = AbsentType::whereIn('Type', [AbsentType::TYPE_OFF])->pluck('Id')->toArray();

        $absents = $employee->absent()->whereIn('AbsentTypeId', $absentType)
            ->where(function ($query) use ($StartDate, $EndDate) {
                $query->where([['StartDate', '>=', $StartDate], ['EndDate', '<=', $EndDate]])
                    ->orWhere([['StartDate', '<=', $StartDate], ['EndDate', '>=', $StartDate]])
                    ->orWhere([['StartDate', '<=', $EndDate], ['EndDate', '>=', $EndDate]]);
            })->get();

        $absents2 = $employee->absent()->whereIn('AbsentTypeId', $absentType2)
            ->where(function ($query) use ($StartDate, $EndDate) {
                $query->where([['StartDate', '>=', $StartDate], ['EndDate', '<=', $EndDate]])
                    ->orWhere([['StartDate', '<=', $StartDate], ['EndDate', '>=', $StartDate]])
                    ->orWhere([['StartDate', '<=', $EndDate], ['EndDate', '>=', $EndDate]]);
            })->get();

        foreach ($absents as $absent) {

            $start = $StartDate > $absent->StartDate ? $StartDate : $absent->StartDate;
            $end = $EndDate < $absent->EndDate ? $EndDate : $absent->EndDate;

            $begin = new \DateTime($start);
            $end = new \DateTime($end . ' +1 day');
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            if ($absent->absentType->Type == AbsentType::ANNUAL_LEAVE) {

                $TotalAnnualAbsent += Carbon::parse($end)->diffInDays($start) + 1;
                // for report page
                $employee->annualAbsentForReport = Carbon::parse($start)->format('Y-m-d');

                foreach ($periodDate as $key => $date) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            "Date" => $date->format('Y-m-d'),
                            "TimekeepingReport" => 0,
                            "Type" => "NPN",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "Date" => $date->format('Y-m-d'),
                            "TimekeepingReport" => 0,
                            "Type" => "NPN",
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
                            "Date" => $date->format('Y-m-d'),
                            "TimekeepingReport" => 0,
                            "Type" => "NKL",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "Fate" => $date->format('Y-m-d'),
                            "TimekeepingReport" => 0,
                            "Type" => "NKL",
                        ];
                    }
                }
            }
        }

        foreach ($absents2 as $absent2) {

            $start = $StartDate > $absent2->StartDate ? $StartDate : $absent2->StartDate;
            $end = $EndDate < $absent2->EndDate ? $EndDate : $absent2->EndDate;

            $begin = new \DateTime($start);
            $end = new \DateTime($end . ' +1 day');
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            if ($absent2->absentType->Type == AbsentType::TYPE_OFF) {
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

        $employee->TotalAnnualAbsent = $TotalAnnualAbsent;
        $employee->TotalUnpaidAbsent = $totalUnpaidAbsent;
        $employee->TotalOffAbsent = $totalOffAbsent;

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator RevokeShift
     * @param object $employee
     * @param string $StartDate
     * @param string $EndDate
     */
    public function getRecordRevokeShift(&$employee, $StartDate, $EndDate, $responseTimeKeepingUser)
    {
        $revokeShifts = $employee->revokeShifts()
            ->where(function ($query) use ($StartDate, $EndDate) {
                $query->where('DateViolation', '>=', $StartDate)->where('DateViolation', '<=', $EndDate);
            })->get();

        if (!empty(count($revokeShifts))) {
            foreach ($revokeShifts as $revokeShift) {

                $checkValue = array_search($revokeShift->DateViolation, array_column($responseTimeKeepingUser, 'date'));

                if (!$checkValue) {
                    $responseTimeKeepingUser[] = [
                        "Date" => $revokeShift->DateViolation->format('Y-m-d'),
                        "TimekeepingReport" => 0,
                        "Type" => "BC",
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
            $results = $this->timekeepingReport($request->EmployeeId, $request->PositionId, $request->store_id, $request->StartDate, $request->EndDate, $request->limit, false, $request->type, $request->work_form_id, $request->is_filter, null, $request->full_name, $request->is_shift);
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
        $params['{StartDate}'] = Carbon::parse($request->StartDate)->format('d-m-Y');
        $params['{EndDate}'] = Carbon::parse($request->EndDate)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[employeeName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[totalWorkdays]'] = [];
        $params['[TotalHourRedundantTimekeeping]'] = [];
        $params['[hourIncrease]'] = [];
        $params['[hourOvertime]'] = [];
        $params['[workOverTime]'] = [];
        $params['[WorkHourRedundant]'] = [];
        $params['[TotalAnnualAbsent]'] = [];
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
            $params['[totalWorkdays]'][] = !empty($employee->TotalRealTimekeeping) ? $employee->TotalRealTimekeeping : '';
            $params['[TotalHourRedundantTimekeeping]'][] = !empty($employee->TotalHourRedundantTimekeeping) ? $employee->TotalHourRedundantTimekeeping : '';
            $params['[hourIncrease]'][] = !empty($employee->hourIncrease) ? $employee->hourIncrease : '';
            $params['[hourOvertime]'][] = !empty($employee->hourOvertime) ? $employee->hourOvertime : '';
            $params['[workOverTime]'][] = !empty($employee->workOverTime) ? $employee->workOverTime : '';
            $params['[WorkHourRedundant]'][] = !empty($employee->WorkHourRedundant) ? $employee->WorkHourRedundant : '';
            $params['[TotalAnnualAbsent]'][] = !empty($employee->TotalAnnualAbsent) ? $employee->TotalAnnualAbsent : '';
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
        $params['{StartDate}'] = Carbon::parse($request->StartDate)->format('d-m-Y');
        $params['{EndDate}'] = Carbon::parse($request->EndDate)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[employeeName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[workForm]'] = [];
        $params['[sum]'] = [];
        $init_hours = [];

        $period = Carbon::create($request->StartDate)->daysUntil($request->EndDate);
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

            $params['[sum]'][] = $employee->TotalRealTimekeeping;
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

        if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
            $params['{StartDate}'] = Carbon::parse($attribute['startDate'])->format('d-m-Y');
            $params['{EndDate}'] = Carbon::parse($attribute['endDate'])->format('d-m-Y');

            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['deviceId'])) {
                    $query->where('DeviceId', $attribute['deviceId']);
                }

                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            })->with(['timekeeping' => function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['deviceId'])) {
                    $query->where('DeviceId', $attribute['deviceId']);
                }

                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
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

        if (!empty($attribute['deviceId'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('DeviceId', $attribute['deviceId']);
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
                $dateTime = $timekeeping->AttendedAt->format('Y-m-d H:m:s');
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

        if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
            $params['{StartDate}'] = Carbon::parse($attribute['startDate'])->format('d-m-Y');
            $params['{EndDate}'] = Carbon::parse($attribute['endDate'])->format('d-m-Y');

            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['deviceId'])) {
                    $query->where('DeviceId', $attribute['deviceId']);
                }

                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            })->with(['timekeeping' => function ($query) use ($attribute) {
                if (!empty($attribute['type'])) {
                    $query->where('type', $attribute['type']);
                }

                if (!empty($attribute['deviceId'])) {
                    $query->where('DeviceId', $attribute['deviceId']);
                }

                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
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

        if (!empty($attribute['deviceId'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->where('DeviceId', $attribute['deviceId']);
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
                $date = $timekeeping->AttendedAt->format('Y-m-d');

                if (!array_key_exists($date, $dataUser)) {
                    $drive = $timekeeping->fingerprintTimekeeper->name;
                    $dateTime = $timekeeping->AttendedAt->format('Y-m-d H:m:s');
                    $shift = '';

                    $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $date, $date);

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
                    $dateTime = $timekeeping->AttendedAt->format('Y-m-d H:m:s');
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
