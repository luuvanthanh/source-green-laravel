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
    protected $userRepositoryEloquent, $user, $quotaWork;

    public function __construct(
        UserRepositoryEloquent $userRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->userRepositoryEloquent = $userRepositoryEloquent;
        $this->user = null;
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

        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
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

        if (!empty($attribute['user_id'])) {
            $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('user_id', explode(',', $attribute['user_id']));
            });
        }

        $timekeeping = !empty($attribute['limit']) ? $this->userRepositoryEloquent->paginate($attribute['limit']) : $this->userRepositoryEloquent->get();

        return $timekeeping;
    }

    /**
     * @param $userId
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
    public function timekeepingReport($userId, $position, $store, $start_date, $end_date, $limit, $parser, $type = null, $work_form_id = null, $isFilter = null, $rank = null, $full_name = null, $is_shift = "true")
    {
        $usersByStore = $this->userRepositoryEloquent->model()::with(['lateEarly' => function ($q) use ($start_date, $end_date) {
            $q->whereDate('date', '>=', $start_date)->whereDate('date', '<=', $end_date);
        }]);

        if ($is_shift === "true") {
            $usersByStore->whereHas('schedules', function ($query) use ($start_date, $end_date) {
                $query->where([['start_date', '<=', $start_date], ['end_date', '>=', $end_date]])
                    ->orWhere([['start_date', '>', $start_date], ['start_date', '<=', $end_date]])
                    ->orWhere([['end_date', '>=', $start_date], ['end_date', '<', $end_date]]);
            });
        }

        if (!is_null($full_name)) {
            $usersByStore->where('full_name', 'like', '%' . $full_name . '%');
        }

        $result = $usersByStore->with(['timekeeping' => function ($query) use ($start_date, $end_date) {
            $query->whereDate('attended_at', '>=', Carbon::parse($start_date)->format('Y-m-d'))
                ->whereDate('attended_at', '<=', Carbon::parse($end_date)->format('Y-m-d'))
                ->orderBy('attended_at');
        }])->get();

        if ($userId) {

            $usersArray = explode(',', $userId);

            $users = $this->userRepositoryEloquent->model()::whereIn('id', $usersArray)->with(['lateEarly' => function ($q) use ($start_date, $end_date) {
                $q->whereDate('date', '>=', Carbon::parse($start_date)->format('Y-m-d'))->whereDate('date', '<=', Carbon::parse($end_date)->format('Y-m-d'));
            }]);

            if ($is_shift === "true") {
                $users->whereHas('schedules', function ($query) use ($start_date, $end_date) {
                    $query->where([['start_date', '<=', $start_date], ['end_date', '>=', $end_date]])
                        ->orWhere([['start_date', '>', $start_date], ['start_date', '<=', $end_date]])
                        ->orWhere([['end_date', '>=', $start_date], ['end_date', '<', $end_date]]);
                });
            }

            $users->with(['timekeeping' => function ($query) use ($start_date, $end_date) {
                $query->whereDate('attended_at', '>=', Carbon::parse($start_date)->format('Y-m-d'))
                    ->whereDate('attended_at', '<=', Carbon::parse($end_date)->format('Y-m-d'))
                    ->orderBy('attended_at');
            }]);

            $users = $users->get();

            foreach ($users as &$user) {
                $result = $this->calculatorTimekeepingReport($user, $start_date, $end_date, $type);
            }

            if ($type == $this->model()::MONTH) {
                return $users;
            }

            $response = $limit == config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO') ? $users : $this->paginateCollection($users, $limit);

            if (!$parser || $type == $this->model()::MONTH) {
                return $users;
            }

            return $this->userRepositoryEloquent->parserResult($response);
        }

        foreach ($result as &$user) {
            $user = $this->calculatorTimekeepingReport($user, $start_date, $end_date, $type);
        }

        if (!$parser || $type == $this->model()::MONTH) {
            return $result;
        }

        $response = $limit == config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO') ? $result : $this->paginateCollection($result, $limit);

        return $this->userRepositoryEloquent->parserResult($response);
    }

    /**
     * Get timekeeping report
     * @param $user
     * @param $start_date
     * @param $end_date
     * @param null $type
     * @return array
     */
    public function calculatorTimekeepingReport($user, $start_date, $end_date, $type = null)
    {
        $this->user = $user;
        $storeRequest = request('store_id');
        $userTimekeeping = [];
        $result = [];
        $responseTimeKeepingUser = [];
        $totalRealTimekeeping = 0;
        $totalHourRedundantTimekeeping = 0;
        $timeKeepingByDate = [];
        $workHourRedundant = 0;
        $workBirthday = 0;

        // thoi gian cham cong
        $userHasTimekeeping = $user->timekeeping;

        // lateEarly
        $lateEarly = $user->lateEarly;

        $userTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($user->id, $start_date, $end_date);

        $begin = new \DateTime($start_date);
        $end = new \DateTime($end_date);
        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        foreach ($periodDate as $key => $date) {
            if (!array_key_exists($date->format('Y-m-d'), $userTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    "date" => $date->format('Y-m-d'),
                    "timekeepingReport" => 0,
                    "type" => "KC",
                ];
            }
        }

        if (count($userHasTimekeeping) > 0) {
            $count = count($userTimeWorkShift);
            $i = 1;

            // get thoi gian cham cong theo ngay
            foreach ($userHasTimekeeping as $timekeeping) {
                $timeKeepingByDate[Carbon::parse($timekeeping->attended_at)->format('Y-m-d')][] = $timekeeping;
            }

            foreach ($userTimeWorkShift as $key => $value) {

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
                        $this->quotaWork = 8;
                        // mac dinh lay tat ca cac ngay
                        $resultTimekeeping[$key] = $this->calculatorTimekeeping($quotaWork, $key, $value, $timeKeepingByDate[$key], $type, $dataAutoApproval);

                        $user->reportTimkeepingPage = [$resultTimekeeping];
                        $result['date'] = $key;
                        $result['timekeepingReport'] = $resultTimekeeping[$key]['totalTimeKeeping'];
                        $result['type'] = null;

                        $responseTimeKeepingUser[] = $result;

                        if ($resultTimekeeping[$key]['totalTimeKeeping'] >= 1) {
                            $totalRealTimekeeping += $resultTimekeeping[$key]['totalTimeKeeping'];
                        } else {

                            $totalHourRedundantTimekeeping += $resultTimekeeping[$key]['totalTimeRedundant'];
                        }
                        $user->totalRealTimekeeping = $totalRealTimekeeping;
                        $user->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : 0;
                        $i++;

                    }

                }
            }

        }

        $user->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : '00:00';
        $responseTimeKeepingUser = $this->calculatorAbsents($user, $start_date, $end_date, $responseTimeKeepingUser);

        // for report page
        $user->dateIncrease = $userOverTime['dateIncrease'];
        $user->dateOvertime = $userOverTime['dateOvertime'];
        // end for report page

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

            $user->totalTimekeepingDate = $totalTimekeepingWork;
            // ngay cong thuc te, gio du sau khi chia
            if ($totalHourRedundantTimekeeping >= ($quotaWork * 3600)) {
                $hourSub = $totalHourRedundantTimekeeping / ($quotaWork * 3600);

                $hoursTemp = floor($hourSub) * $quotaWork;

                $user->totalRealTimekeeping = $user->totalRealTimekeeping + floor($hourSub);
                $hourRedundantAfterSub = $totalHourRedundantTimekeeping - ($hoursTemp * 3600);

            } else {
                $hourRedundantAfterSub = $totalHourRedundantTimekeeping;
            }

            $user->totalHourRedundantTimekeeping = gmdate('H:i', $hourRedundantAfterSub);

            $totalTimekeepingWork = $totalTimekeepingWork >= 1 ? $totalTimekeepingWork : 0;

            // thuc cong
            $totalWorks = ($user->totalRealTimekeeping + $user->totalAnnualAbsent) > 0
            ? $user->totalRealTimekeeping + $user->totalAnnualAbsent
            : $totalTimekeepingWork;

            $hourSub = $hourRedundant / ($quotaWork * 3600);
            $hourRedundant = $hourRedundantAfterSub;

            //sinh nhật user
            $hourBirthday = 0;
            $workAddBrithday = 0;
            $workBirthday = 0;

            if (($type != $this->model()::PART_TIME && $type != 'PART_TIME_SECOND') && !is_null($user->birthday)) {
                $yearStart = Carbon::parse($start_date)->format('Y');
                $yearEnd = Carbon::parse($end_date)->format('Y');

                $birthdayForYearStart = $user->birthday->setYear($yearStart);

                $birthdayForYearEnd = $user->birthday->setYear($yearEnd);

                $workTime = $user->workTime;

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

            $user->totalWorks = $totalWorks;
            $user->workBirthday = $workBirthday;
            $user->totalHourRedundantWorks = $type == $this->model()::MONTH ? $hourRedundant : gmdate("H:i", $hourRedundant);
            $user->totalHourRedundantWorksFormatDate = round($hourRedundant / ($quotaWork * 3600), 2);

            // la cham cong gio, format timekeeping report: H:i
            if ($type && ($type == $this->model()::PART_TIME || $type == 'PART_TIME_SECOND') && !empty($responseTimeKeepingUser)) {
                // sum hours minutes part time
                $totalHours = floor($totalHoursMinutesPartTime / 60);
                $totalHoursMinutesPartTime -= $totalHours * 60;
                $user->totalRealTimekeeping = sprintf('%02d:%02d', $totalHours, $totalHoursMinutesPartTime);
            }

        }

        $user->timeKeepingReport = $responseTimeKeepingUser;

        return $user;
    }

    /**
     * @param $i
     * @param $count
     * @param $user
     * @param $totalRealTimekeeping
     * @param $totalHourRedundantTimekeeping (DO NOT USE)
     */
    public function setAttributeForUser($i, $count, $user, $totalRealTimekeeping, $totalHourRedundantTimekeeping)
    {
        if ($i == $count) {
            $user->totalRealTimekeeping = $totalRealTimekeeping;
            $user->totalHourRedundantTimekeeping = $totalHourRedundantTimekeeping > 0 ? gmdate("H:i", $totalHourRedundantTimekeeping) : 0;
        }
    }
    /**`
     * Get workshift by user
     * @param $userHasWorkShift
     * @return mixed
     */
    public function getWorkShiftByUser($userHasWorkShift)
    {
        $userTimeWorkShift = [];
        foreach ($userHasWorkShift as $item) {
            foreach ($item->user as $value) {
                $getWorkTimes = $value->pivot->shift_time;
                $workTimes = json_decode($getWorkTimes, true);
                $userTimeWorkShift[Carbon::parse($item->work_date)->format('Y-m-d')]['workShiftTimes'] = $workTimes;
            }
        }

        return $userTimeWorkShift;
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
            $userTracking = $this->ruleTimeAllow($date, $key, $timeKeepingByDate, $item);
            $userTrackingStartTime = isset($userTracking[$date][$key][Timekeeping::CHECK_IN])
            ? strtotime($userTracking[$date][$key][Timekeeping::CHECK_IN])
            : 0;
            $userTrackingEndTime = isset($userTracking[$date][$key][Timekeeping::CHECK_OUT])
            ? strtotime($userTracking[$date][$key][Timekeeping::CHECK_OUT])
            : 0;

            if ($userTrackingStartTime > 0 && $userTrackingEndTime > 0) {
                $workShiftStartTime = strtotime($item['start_time']);
                $workShiftEndTime = strtotime($item['end_time']);

                $attributeApplyRule = [
                    'totalShiftTime' => strtotime($item['end_time']) - strtotime($item['start_time']),
                    'workShiftStartTime' => $workShiftStartTime,
                    'workShiftEndTime' => $workShiftEndTime,
                    'userTrackingStartTime' => $userTrackingStartTime,
                    'userTrackingEndTime' => $userTrackingEndTime,
                    'timeSlot' => $item['start_time'] . '-' . $item['end_time'],
                ];

                $mealTime = !empty($item['meal_time']) ? $item['meal_time'] * 3600 : 0;
                $resultCalculator += $this->applyRule($attributeApplyRule, $date, $dataAutoApproval, $mealTime);
                $resultCalculatorHours += $userTrackingEndTime - $userTrackingStartTime;
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

        $userTracking = [];
        $userTracking[$date][$key][Timekeeping::CHECK_IN] = null;
        $userTracking[$date][$key][Timekeeping::CHECK_OUT] = null;

        $durationAllow[$date]['validTimeStart'] = $this->getDurationsAllow($date, $item['start_time'], Timekeeping::ALLOW_START_TIME, $key);
        $durationAllow[$date]['validTimeEnd'] = $this->getDurationsAllow($date, $item['end_time'], Timekeeping::ALLOW_END_TIME, $key);

        foreach ($timeKeepingByDate as $time) {
            if ($time->attended_at >= $durationAllow[$date]['validTimeStart'][0]
                && $time->attended_at <= $durationAllow[$date]['validTimeStart'][1]) {
                if (!($userTracking[$date][$key][Timekeeping::CHECK_IN])) {
                    $userTracking[$date][$key][Timekeeping::CHECK_IN]
                    = Carbon::parse($time->attended_at)->format($formatHIS);
                }

            } elseif ($time->attended_at >= $durationAllow[$date]['validTimeEnd'][0]
                && $time->attended_at <= $durationAllow[$date]['validTimeEnd'][1]) {
                $userTracking[$date][$key][Timekeeping::CHECK_OUT] = Carbon::parse($time->attended_at)->format($formatHIS);
            }
        }

        return $userTracking;
    }

    /**
     * @param $attribute
     * @param $date
     * @return mixed
     */
    public function applyRule($attribute, $date, $dataAutoApproval, $mealTime = 0)
    {
        $time = 0;
        if (!empty($attribute)) {

            $getConfigEarly = LateEarlyTimeConfig::where('type', LateEarlyTimeConfig::EARLY)->pluck('id')->toArray();
            $getConfigLate = LateEarlyTimeConfig::where('type', LateEarlyTimeConfig::LATE)->pluck('id')->toArray();

            $existLate = LateEarly::where('user_id', $this->user->id)
                ->whereDate('date', $date)
                ->whereIn('time_config_type', $getConfigLate)
                ->where('time_slot', $attribute['timeSlot'])
                ->first();

            $existEarly = LateEarly::where('user_id', $this->user->id)
                ->whereDate('date', $date)
                ->whereIn('time_config_type', $getConfigEarly)
                ->where('time_slot', $attribute['timeSlot'])
                ->first();

            $existAutoApproval = $dataAutoApproval['existAutoApproval'];

            // auto approval and early
            if (!empty($existAutoApproval) && !empty($existEarly)) {
                $time = strtotime(gmdate('H:i:s', $attribute['workShiftEndTime'] - strtotime($existEarly->time))) - $attribute['userTrackingStartTime'];
            } elseif (!empty($existAutoApproval)) {
                $time = $attribute['workShiftEndTime'] - $attribute['userTrackingStartTime'];
            }

            // ony late
            if (!empty($existLate) && empty($existEarly)) {
                // dd(1);
                $time = $attribute['workShiftEndTime'] - $attribute['userTrackingStartTime'];
            }

            // ony early
            if (empty($existLate) && !empty($existEarly)) {

                $time = strtotime(gmdate('H:i:s', $attribute['workShiftEndTime'] - strtotime($existEarly->time))) - $attribute['workShiftStartTime'];
            }

            // late && early
            if (!empty($existLate) && !empty($existEarly)) {

                $timeEarly = gmdate("H:i:s", $attribute['workShiftEndTime'] - strtotime($existEarly->time));
                $time = strtotime($timeEarly) - $attribute['userTrackingStartTime'];
            }

            if (empty($existLate) && empty($existEarly)) {
                $time = $attribute['totalShiftTime'];
            }

            if (!empty($mealTime)) {
                $time = $time - $mealTime;
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
     * @param object $user
     * @param string $start_date
     * @param string $end_date
     */
    public function calculatorAbsents(&$user, $start_date, $end_date, $responseTimeKeepingUser)
    {
        $totalUnpaidAbsent = 0;
        $totalAnnualAbsent = 0;
        $totalOffAbsent = 0;

        $absentType = AbsentType::whereIn('type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE])->pluck('id')->toArray();
        $absentType2 = AbsentType::whereIn('type', [AbsentType::TYPE_OFF])->pluck('id')->toArray();

        $absents = $user->absent()->whereIn('absent_type_id', $absentType)
            ->where(function ($query) use ($start_date, $end_date) {
                $query->where([['start_date', '>=', $start_date], ['end_date', '<=', $end_date]])
                    ->orWhere([['start_date', '<=', $start_date], ['end_date', '>=', $start_date]])
                    ->orWhere([['start_date', '<=', $end_date], ['end_date', '>=', $end_date]]);
            })->approved()->get();

        $absents2 = $user->absent()->whereIn('absent_type_id', $absentType2)
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
                $user->annualAbsentForReport = Carbon::parse($start)->format('Y-m-d');

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

        $user->totalAnnualAbsent = $totalAnnualAbsent;
        $user->totalUnpaidAbsent = $totalUnpaidAbsent;
        $user->totalOffAbsent = $totalOffAbsent;

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
            $results = $this->timekeepingReport($request->user_id, $request->position_id, $request->store_id, $request->start_date, $request->end_date, $request->limit, false, $request->type, $request->work_form_id, $request->is_filter, null, $request->full_name, $request->is_shift);
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
        $params['[userName]'] = [];
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

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[userName]'][] = $user->full_name;
            $params['[store]'][] = !empty($user->rankPositionInformation->store) ? $user->rankPositionInformation->store->name : '';
            $params['[position]'][] = !empty($user->rankPositionInformation->position) ? $user->rankPositionInformation->position->name : '';
            $params['[work_forms]'][] = !empty($user->rankPositionInformation->workForm) ? $user->rankPositionInformation->workForm->name : '';
            $params['[totalWorkdays]'][] = !empty($user->totalRealTimekeeping) ? $user->totalRealTimekeeping : '';
            $params['[totalHourRedundantTimekeeping]'][] = !empty($user->totalHourRedundantTimekeeping) ? $user->totalHourRedundantTimekeeping : '';
            $params['[hourIncrease]'][] = !empty($user->hourIncrease) ? $user->hourIncrease : '';
            $params['[hourOvertime]'][] = !empty($user->hourOvertime) ? $user->hourOvertime : '';
            $params['[workOverTime]'][] = !empty($user->workOverTime) ? $user->workOverTime : '';
            $params['[workHourRedundant]'][] = !empty($user->workHourRedundant) ? $user->workHourRedundant : '';
            $params['[totalAnnualAbsent]'][] = !empty($user->totalAnnualAbsent) ? $user->totalAnnualAbsent : '';
            $params['[totalUnpaidAbsent]'][] = !empty($user->totalUnpaidAbsent) ? $user->totalUnpaidAbsent : '';
            $params['[totalAbsentOff]'][] = !empty($user->totalOffAbsent) ? $user->totalOffAbsent : '';
            $params['[totalAdditionalTimes]'][] = !empty($user->additionalTimes) ? $user->additionalTimes : '';
            $params['[totalAdditionalHours]'][] = !empty($user->additionalHours) ? $user->additionalHours : '';
            $params['[totalSubtractionTimes]'][] = !empty($user->subtractionTimes) ? $user->subtractionTimes : '';
            $params['[totalSubtractionHours]'][] = !empty($user->subtractionHours) ? $user->subtractionHours : '';
            $params['[realWorks]'][] = !empty($user->totalWorks) ? round($user->totalWorks, 2) : '';
            $params['[hourRedundant]'][] = !empty($user->totalHourRedundantWorks) ? $user->totalHourRedundantWorks : '';
            $params['[workBirthday]'][] = !empty($user->workBirthday) ? $user->workBirthday : '';
            $params['[workDeclaration]'][] = !empty($user->totalWorkDeclarations) ? $user->totalWorkDeclarations : '';
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
        $params['[userName]'] = [];
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

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[userName]'][] = $user->full_name;
            $params['[store]'][] = $user->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $user->rankPositionInformation->position->name ?? '';
            $params['[workForm]'][] = $user->rankPositionInformation->workForm->name ?? '';
            $hours = $init_hours;

            if (!empty($user->timeKeepingReport)) {

                foreach ($user->timeKeepingReport as $item) {

                    $hours[$item['date']] = $item['timekeepingReport'];

                }
            }

            $params['[[hours]]'][] = array_values($hours);

            $params['[sum]'][] = $user->totalRealTimekeeping;
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
        $params['[userName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];
        $params['[workForm]'] = [];
        $params['[totalTimekeeping]'] = [];
        $params['[totalHour]'] = [];

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[userName]'][] = $user->full_name;
            $params['[store]'][] = $user->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $user->rankPositionInformation->position->name ?? '';
            $params['[workForm]'][] = $user->rankPositionInformation->workForm->name ?? '';
            $params['[totalTimekeeping]'][] = $user->totalTimekeepingByMonth ?? '';
            $params['[totalHour]'][] = $user->totalHourRedundantByMonth ?? '';

            if (!empty($user->timeKeepingReport)) {
                $month = 1;
                foreach ($user->timeKeepingReport as $key => $item) {
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
        $query = $this->userRepositoryEloquent->model->query();

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

        $query->tranferHistory($attribute);
        $query->orderByUserByPosition();

        if (!empty($attribute['user_id'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('user_id', explode(',', $attribute['user_id']));
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

        foreach ($data as $key => $user) {
            $detail = null;
            $number = null;

            foreach ($user->timekeeping as $timekeeping) {
                $drive = $timekeeping->fingerprintTimekeeper->name;
                $dateTime = $timekeeping->attended_at->format('Y-m-d H:m:s');
                $detail .= "$drive -  $dateTime \n";
            }

            $result[] = [
                'stt' => ++$key,
                'full_name' => $user->full_name,
                'store' => $user->rankPositionInformation->store->name ?? '',
                'position' => $user->rankPositionInformation->position->name ?? '',
                'number' => $user->timekeeping->count(),
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
        $query = $this->userRepositoryEloquent->model->query();

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

        $query->tranferHistory($attribute);
        $query->orderByUserByPosition();

        if (!empty($attribute['user_id'])) {
            $query->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('user_id', explode(',', $attribute['user_id']));
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

        foreach ($data as $key => $user) {
            $detail = null;
            $number = null;

            $result[] = [
                'stt' => ++$key,
                'full_name' => $user->full_name,
                'store' => $user->rankPositionInformation->store->name ?? '',
                'position' => $user->rankPositionInformation->position->name ?? '',
                'shift' => '',
                'number' => $user->timekeeping->count(),
                'detail' => '',
            ];

            $dataUser = [];
            foreach ($user->timekeeping as $timekeeping) {
                $date = $timekeeping->attended_at->format('Y-m-d');

                if (!array_key_exists($date, $dataUser)) {
                    $drive = $timekeeping->fingerprintTimekeeper->name;
                    $dateTime = $timekeeping->attended_at->format('Y-m-d H:m:s');
                    $shift = '';

                    $userHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($user->id, $date, $date);

                    if (!empty($userHasWorkShift)) {
                        $countItemShift = count($userHasWorkShift[$date]);

                        if ($countItemShift == 1) {
                            $shiftCode = $userHasWorkShift[$date][0]['shift_code'];
                            $timeStart = $userHasWorkShift[$date][0]['start_time'];
                            $timeEnd = $userHasWorkShift[$date][0]['end_time'];
                            $timeShift = "$timeStart - $timeEnd";
                            $shift = "$shiftCode \n($timeShift)";
                        } else {
                            $shiftCode = $userHasWorkShift[$date][0]['shift_code'];

                            for ($i = 0; $i < $countItemShift; $i++) {
                                $timeStart = $userHasWorkShift[$date][$i]['start_time'];
                                $timeEnd = $userHasWorkShift[$date][$i]['end_time'];
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
