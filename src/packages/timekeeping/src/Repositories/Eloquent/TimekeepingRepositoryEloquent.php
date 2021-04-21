<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Config\Models\Config;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Presenters\TimekeepingPresenter;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
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
     * @param $startDate
     * @param $endDate
     * @param $limit
     * @param bool $parser
     * @param $type
     * @param null $work_form_id
     * @param null $isFilter
     * @param null $rank
     * @return mixed
     */
    public function timekeepingReport(array $attributes)
    {
        $employeesByStore = $this->employeeRepositoryEloquent->model()::with(['lateEarly' => function ($q) use ($attributes) {
            $q->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
        }])->with(['addSubTime' => function ($query) use ($attributes) {

            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $q->where('StartDate', '>=', $attributes['startDate']);
                $q->where('EndDate', '<=', $attributes['endDate']);
            }
        }]);

        if (!empty($attributes['isShift'])) {
            $employeesByStore->whereHas('schedules', function ($query) use ($attributes) {
                $query->where([['StartDate', '<=', $attributes['StartDate']], ['EndDate', '>=', $$attributes['endDate']]])
                    ->orWhere([['StartDate', '>', $attributes['StartDate']], ['StartDate', '<=', $$attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['StartDate']], ['EndDate', '<', $$attributes['endDate']]]);
            });
        }

        if (!empty($attributes['fullName'])) {
            $employeesByStore->where('FullName', 'like', '%' . $attributes['fullName'] . '%');
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $employeesByStore->whereIn('Id', $employeeId);
        }

        $employeesByStore->with(['timekeeping' => function ($query) use ($attributes) {
            $query->whereDate('AttendedAt', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                ->whereDate('AttendedAt', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'))
                ->orderBy('AttendedAt');
        }]);

        if (empty($attributes['limit'])) {
            $result = $employeesByStore->get();
        } else {
            $result = $employeesByStore->paginate($attributes['limit']);
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorTimekeepingReport($employee, $attributes);
        }

        return $this->employeeRepositoryEloquent->parserResult($result);
    }

    /**
     * Get timekeeping report
     * @param $employee
     * @param $startDate
     * @param $endDate
     * @param null $type
     * @return array
     */
    public function calculatorTimekeepingReport($employee, $attributes)
    {
        $startDate = $attributes['startDate'];
        $endDate = $attributes['endDate'];
        $type = !empty($attributes['type']) ? $attributes['type'] : null;

        $this->employee = $employee;
        $employeeTimekeeping = [];
        $result = [];
        $responseTimeKeepingUser = [];
        $totalRealTimekeeping = 0;
        $totalHourRedundantTimekeeping = 0;
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

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $startDate, $endDate);

        $begin = new \DateTime($startDate);
        $end = new \DateTime($endDate);
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
                            "date" => $key,
                            "timekeepingReport" => 0,
                            "type" => "KXD",
                        ];
                    } else {
                        $quotaWork = 0;
                        foreach ($value as $item) {
                            $quotaWork += (strtotime($item['EndTime']) - strtotime($item['StartTime'])) / 3600;
                        }

                        $this->quotaWork = $quotaWork;
                        $resultTimekeeping[$key] = $this->calculatorTimekeeping($quotaWork, $key, $value, $timeKeepingByDate[$key], $type, $dataAutoApproval);

                        $employee->reportTimkeepingPage = [$resultTimekeeping];
                        $result['date'] = $key;
                        $result['timekeepingReport'] = $resultTimekeeping[$key]['TotalTimeKeeping'];
                        $result['type'] = null;

                        $responseTimeKeepingUser[] = $result;

                        if ($resultTimekeeping[$key]['TotalTimeKeeping'] >= 1) {
                            $totalRealTimekeeping += $resultTimekeeping[$key]['TotalTimeKeeping'];
                        } else {
                            $totalHourRedundantTimekeeping += $resultTimekeeping[$key]['TotalTimeRedundant'];
                        }

                        $employee->totalRealTimekeeping = $totalRealTimekeeping;
                        $employee->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : 0;
                        $i++;

                    }

                }
            }

        }

        $employee->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : '00:00';
        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $startDate, $endDate, $responseTimeKeepingUser);
        $responseTimeKeepingUser = $this->getRecordRevokeShift($employee, $startDate, $endDate, $responseTimeKeepingUser);
        $workWeclaration = $this->getWorkDeclarations($employee, $startDate, $endDate);
        $workHourSupport = $this->getWorkHourSupport($employee, $startDate, $endDate);

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
                $yearStart = Carbon::parse($startDate)->format('Y');
                $yearEnd = Carbon::parse($endDate)->format('Y');

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

                            if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($startDate)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($endDate)->format('Y-m-d'))
                                || ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($startDate)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($endDate)->format('Y-m-d'))) {

                                $workBirthday = 1;
                                $workAddBrithday = 1;
                                if ($yearStart !== $yearEnd) {
                                    if (($birthdayForYearStart->format('Y-m-d') >= Carbon::parse($startDate)->format('Y-m-d') && $birthdayForYearStart->format('Y-m-d') <= Carbon::parse($endDate)->format('Y-m-d'))
                                        && ($birthdayForYearEnd->format('Y-m-d') >= Carbon::parse($startDate)->format('Y-m-d') && $birthdayForYearEnd->format('Y-m-d') <= Carbon::parse($endDate)->format('Y-m-d'))) {
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

            $totalShiftTime += strtotime($item['EndTime']) - strtotime($item['StartTime']);
            if (isset($value[$key]['StartTime']) && isset($value[$key + 1]['EndTime'])) {
                $totalBreakTime += strtotime($value[$key + 1]['StartTime']) - strtotime($value[$key]['EndTime']);
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
                $workShiftStartTime = strtotime($item['StartTime']);
                $workShiftEndTime = strtotime($item['EndTime']);

                $attributeApplyRule = [
                    'totalShiftTime' => strtotime($item['EndTime']) - strtotime($item['StartTime']),
                    'workShiftStartTime' => $workShiftStartTime,
                    'workShiftEndTime' => $workShiftEndTime,
                    'employeeTrackingStartTime' => $employeeTrackingStartTime,
                    'employeeTrackingEndTime' => $employeeTrackingEndTime,
                    'timeSlot' => $item['StartTime'] . '-' . $item['EndTime'],
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

        $durationAllow[$date]['validTimeStart'] = $this->getDurationsAllow($date, $item['StartTime'], Timekeeping::ALLOW_START_TIME, $key);
        $durationAllow[$date]['validTimeEnd'] = $this->getDurationsAllow($date, $item['EndTime'], Timekeeping::ALLOW_END_TIME, $key);

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
            $minutesBeforeStart = Config::where('Code', 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND')->first()->Value;
        } else {
            $minutesBeforeStart = Config::where('Code', 'DURATION_ALLOW_BEFORE_STARTTIME')->first()->Value;
        }

        $minutesAfterStart = Config::where('Code', 'DURATION_ALLOW_AFTERT_STARTTIME')->first()->Value;
        $minutesBeforeEnd = Config::where('Code', 'DURATION_ALLOW_BEFORE_ENDTIME')->first()->Value;
        $minutesAfterEnd = Config::where('Code', 'DURATION_ALLOW_AFTERT_ENDTIME')->first()->Value;

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
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorAbsents(&$employee, $startDate, $endDate, $responseTimeKeepingUser)
    {
        $totalUnpaidAbsent = 0;
        $totalAnnualAbsent = 0;
        $totalOffAbsent = 0;

        $absentType = AbsentType::whereIn('Type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE])->pluck('Id')->toArray();
        $absentType2 = AbsentType::whereIn('Type', [AbsentType::TYPE_OFF])->pluck('Id')->toArray();

        $absents = $employee->absent()->whereIn('AbsentTypeId', $absentType)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where([['StartDate', '>=', $startDate], ['EndDate', '<=', $endDate]])
                    ->orWhere([['StartDate', '<=', $startDate], ['EndDate', '>=', $startDate]])
                    ->orWhere([['StartDate', '<=', $endDate], ['EndDate', '>=', $endDate]]);
            })->get();

        $absents2 = $employee->absent()->whereIn('AbsentTypeId', $absentType2)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where([['StartDate', '>=', $startDate], ['EndDate', '<=', $endDate]])
                    ->orWhere([['StartDate', '<=', $startDate], ['EndDate', '>=', $startDate]])
                    ->orWhere([['StartDate', '<=', $endDate], ['EndDate', '>=', $endDate]]);
            })->get();

        foreach ($absents as $absent) {

            $start = $startDate > $absent->StartDate ? $startDate : $absent->StartDate;
            $end = $endDate < $absent->EndDate ? $endDate : $absent->EndDate;

            $begin = new \DateTime($start);
            $end = new \DateTime($end . ' +1 day');
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end);

            if ($absent->absentType->Type == AbsentType::ANNUAL_LEAVE) {

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
                            "Fate" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "NKL",
                        ];
                    }
                }
            }
        }

        foreach ($absents2 as $absent2) {

            $start = $startDate > $absent2->StartDate ? $startDate : $absent2->StartDate;
            $end = $endDate < $absent2->EndDate ? $endDate : $absent2->EndDate;

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

        $employee->totalAnnualAbsent = $totalAnnualAbsent;
        $employee->totalUnpaidAbsent = $totalUnpaidAbsent;
        $employee->totalOffAbsent = $totalOffAbsent;

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator RevokeShift
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function getRecordRevokeShift(&$employee, $startDate, $endDate, $responseTimeKeepingUser)
    {
        $revokeShifts = $employee->revokeShifts()
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('DateViolation', '>=', $startDate)->where('DateViolation', '<=', $endDate);
            })->get();

        if (!empty(count($revokeShifts))) {
            foreach ($revokeShifts as $revokeShift) {

                $checkValue = array_search($revokeShift->DateViolation, array_column($responseTimeKeepingUser, 'date'));

                if (!$checkValue) {
                    $responseTimeKeepingUser[] = [
                        "date" => $revokeShift->DateViolation->format('Y-m-d'),
                        "timekeepingReport" => 0,
                        "type" => "BC",
                    ];
                }
            }
        }

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator WorkDeclarations
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function getWorkDeclarations(&$employee, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($startDate);

        $workDeclarations = $employee->workDeclarations()->whereHas('workDeclarationDetails', function ($q) use ($startDate, $endDate) {
            $q->where('Month', '>=', $startDate->format('Y-m-d'))->where('Month', '<=', $endDate->format('Y-m-d'));
        })->with(['workDeclarationDetails' => function ($q) use ($startDate, $endDate) {
            $q->where('Month', '>=', $startDate->format('Y-m-d'))->where('Month', '<=', $endDate->format('Y-m-d'));
        }])->get();

        $totalWorkDeclarations = 0;

        if (!empty($workDeclarations)) {

            foreach ($workDeclarations as $workDeclaration) {
                foreach ($workDeclaration->workDeclarationDetails as $detail) {
                    if (!empty($detail->WorkNumber)) {
                        $totalWorkDeclarations += $detail->WorkNumber;
                    }
                }
            }
        }

        $employee->totalWorkDeclarations = $totalWorkDeclarations;
    }

    public function getWorkHourSupport(&$employee, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        $workHourSupports = $employee->workHours()->where('Date', '>=', $startDate->format('Y-m-d'))->where('Date', '<=', $endDate->format('Y-m-d'))
            ->get();

        $totalWorkHourSupport = 0;

        if (!empty($workHourSupports)) {
            foreach ($workHourSupports as $workHourSupport) {
                foreach (json_decode($workHourSupport->Hours) as $value) {
                    $totalWorkHourSupport += strtotime($value->Out) - strtotime($value->In);
                }
            }
        }

        $employee->totalWorkHourSupport = gmdate('H:i', $totalWorkHourSupport);
    }
}
