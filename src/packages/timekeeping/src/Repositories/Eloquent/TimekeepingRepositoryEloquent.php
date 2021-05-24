<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use Carbon\Carbon;
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
        $timeKeepingByDate = [];

        // thoi gian cham cong
        $employeeHasTimekeeping = $employee->timekeeping;

        // get thoi gian cham cong theo ngay
        foreach ($employeeHasTimekeeping as $timekeeping) {
            $timeKeepingByDate[Carbon::parse($timekeeping->AttendedAt)->format('Y-m-d')][] = $timekeeping;
        }

        // lateEarly
        $lateEarly = $employee->lateEarly;

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $startDate, $endDate);

        $begin = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        foreach ($periodDate as $date) {
            if (!array_key_exists($date->format('Y-m-d'), $employeeTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    "date" => $date->format('Y-m-d'),
                    "timekeepingReport" => 0,
                    "type" => "KC",
                ];
            }

            if (!array_key_exists($date->format('Y-m-d'), $timeKeepingByDate)) {
                $responseTimeKeepingUser[] = [
                    "date" => $date->format('Y-m-d'),
                    "timekeepingReport" => 0,
                    "type" => "KXD",
                ];
            }
        }

        if (count($employeeHasTimekeeping) > 0) {
            $count = count($employeeTimeWorkShift);
            $i = 1;
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
                        $result['type'] = $resultTimekeeping[$key]['TotalTimeKeeping'] == 1 ? 'x' : 'KXD';

                        $responseTimeKeepingUser[] = $result;
                        $i++;
                    }

                }
            }

        }

        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $startDate, $endDate, $responseTimeKeepingUser);
        $responseTimeKeepingUser = $this->calculatorBusinessTravel($employee, $startDate, $endDate, $responseTimeKeepingUser);

        $totalWorks = 0;

        foreach ($responseTimeKeepingUser as &$item) {
            $totalWorks += $item['timekeepingReport'];
        }

        $employee->totalWorks = $totalWorks;

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

            $response = $resultCalculator / ($quotaWork * 3600) >= 1 ? 1 : ($resultCalculator / ($quotaWork * 3600));

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
     * Calculator Absents
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorAbsents(&$employee, $startDate, $endDate, $responseTimeKeepingUser)
    {

        $absents = $employee->absent()->whereHas('absentDetail', function ($query) use ($startDate, $endDate) {
            $query->where('Date', '>=', $startDate)->where('Date', '<=', $endDate);
        })->get();

        foreach ($absents as $absent) {
            $code = $absent->absentType->Code;
            foreach ($absent->absentDetail as $value) {
                $checkValue = array_search($value->Date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                $type = $value->IsFullDate ? $code : $code . "/2";
                $timekeepingReport = $value->IsFullDate ? 1 : 0.5;
                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                }

            }
        }

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator Absents
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorBusinessTravel(&$employee, $startDate, $endDate, $responseTimeKeepingUser)
    {
        $businessCards = $employee->businessCard()->whereHas('businessCardDetail', function ($query) use ($startDate, $endDate) {
            $query->where('Date', '>=', $startDate)->where('Date', '<=', $endDate);
        })->whereHas('absentType', function ($query) {
            $query->where('Type', 'BUSINESS_TRAVEL');
        })->get();

        foreach ($businessCards as $businessCard) {
            $code = $businessCard->absentType->Code;
            foreach ($businessCard->businessCardDetail as $value) {
                $checkValue = array_search($value->Date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                $type = $value->IsFullDate ? $code : $code . "/2";
                $timekeepingReport = $value->IsFullDate ? 1 : 0.5;
                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                }

            }
        }

        return $responseTimeKeepingUser;
    }

    public function invalidTimekeeping(array $attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->with(['timekeeping' => function ($query) use ($attribute) {
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
}
