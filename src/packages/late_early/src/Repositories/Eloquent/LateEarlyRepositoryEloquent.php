<?php

namespace GGPHP\LateEarly\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Config\Models\Config;
use GGPHP\Division\Models\RankPositionInformation;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\LateEarly\Models\LateEarlyTimeConfig;
use GGPHP\LateEarly\Presenters\LateEarlyPresenter;
use GGPHP\LateEarly\Repositories\LateEarly\LateEarlyRepository;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LateEarlyRepositoryEloquent extends BaseRepository implements LateEarlyRepository
{
    protected $fieldSearchable = [
        'lateEarlyConfig.type', 'status',
        'user.full_name' => 'like',
        'user_id',
        'status_work_declaration',
    ];

    protected $userRepositoryEloquent, $timekeepingRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $userRepositoryEloquent,
        Application $app,
        TimekeepingRepositoryEloquent $timekeepingRepositoryEloquent
    ) {
        parent::__construct($app);
        $this->userRepositoryEloquent = $userRepositoryEloquent;
        $this->timekeepingRepositoryEloquent = $timekeepingRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return LateEarly::class;
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
        return LateEarlyPresenter::class;
    }

    /**
     * @param $attributes
     * @return mixed
     */
    public function filterLateEarly($attributes)
    {
        $this->model = $this->model->query();

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', explode(',', $attributes['status']));
        }

        $this->model = $this->model->whereHas('user', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        // tra cuu di tre ve som kiosk
        if (!empty($attributes['user_id'])) {
            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $this->model = $this->model->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
                $this->model = $this->model->whereHas('user', function ($query) use ($attributes) {
                    if (!empty($attributes['user_id'])) {
                        $query->where('user_id', $attributes['user_id']);
                    };
                })->lateEarlyDeclineAutoApprove();

            }
        } else {
            $this->model = $this->model->whereNotIn('status', [LateEarly::INVALID]);

            if (!empty($attributes['type'])) {
                $this->model = $this->model->whereHas('lateEarlyConfig', function ($queryTypeLateEarly) use ($attributes) {
                    $type = explode(',', $attributes['type']);
                    $queryTypeLateEarly->whereIn('type', [$type]);
                });
            }

        }

        if (!empty($attributes['limit'])) {
            $lateEarlies = $this->paginate($attributes['limit']);
        } else {
            $lateEarlies = $this->get();
        }

        return $lateEarlies;
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getLateEarlyByUser($attributes)
    {
        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->query();

        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->whereHas('lateEarly', function ($query) use ($attributes) {
            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            }

            if (!empty($attributes['user_id'])) {
                $query->whereIn('user_id', explode(',', $attributes['user_id']));
            }

            $query->lateEarlyDeclineAutoApprove();
        })->with(['lateEarly' => function ($query) use ($attributes) {
            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            }

            if (!empty($attributes['user_id'])) {
                $query->whereIn('user_id', explode(',', $attributes['user_id']));
            }

            $query->lateEarlyDeclineAutoApprove();
        }]);

        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->tranferHistory($attributes);

        if (!empty($attributes['limit'])) {
            $users = $this->userRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $users = $this->userRepositoryEloquent->get();
        }

        return $users;
    }

    /**
     * @param  array $attributes
     * @return object
     */
    public function export($request, $report = false)
    {
        $query = $this->model->query();
        if ($request->start_date && $request->end_date) {
            $query->whereDate('date', '>=', $request->start_date)->whereDate('date', '<=', $request->end_date);
        }
        $query->lateEarlyDeclineAutoApprove();
        if ($request->user_id) {
            $query->whereIn('user_id', explode(',', $request->user_id));
        }
        if ($request->store_id || $request->position_id || $request->rank_id) {
            $query->whereHas('user', function ($query) use ($request) {
                $query->whereHas('rankPositionInformation', function ($query) use ($request) {
                    if ($request->store_id) {
                        $query->whereHas('store', function ($query) use ($request) {
                            $query->where('id', $request->store_id);
                        });
                    }
                    if ($request->position_id) {
                        $query->whereHas('position', function ($query) use ($request) {
                            $query->where('id', $request->position_id);
                        });
                    }
                    if ($request->rank_id) {
                        $query->whereHas('rank', function ($query) use ($request) {
                            $query->where('id', $request->rank_id);
                        });
                    }
                });
            });
        }

        $query->whereHas('user', function ($query) use ($report) {
            if (!$report) {
                $query->where('status', 'ON');
            }
        });

        if ($report) {
            return $query->get();
        }

        $data = $query->select('time_config_type', \DB::raw('count(*) as count, user_id, time_config_type'))
            ->groupBy('user_id', 'time_config_type')
            ->get()
            ->groupBy('user_id');

        $params = [];
        $params['{start_date}'] = Carbon::parse($request->start_date)->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($request->end_date)->format('d-m-Y');

        $late_configs = (new LateEarlyTimeConfig)->where('type', LateEarlyTimeConfig::LATE)->get();
        $early_configs = (new LateEarlyTimeConfig)->where('type', LateEarlyTimeConfig::EARLY)->get();
        $late_key = [];
        $late_lables = [];
        foreach ($late_configs as $item) {
            $late_key[$item->id] = 0;
            $late_lables[] = 'Đi trễ ' . $item->description;
        }
        $early_key = [];
        $early_lables = [];
        foreach ($early_configs as $item) {
            $early_key[$item->id] = 0;
            $early_lables[] = 'Về sớm ' . $item->description;
        }

        $params['[[late_configs]]'][] = $late_lables;
        $params['[[early_configs]]'][] = $early_lables;
        $number = 0;
        foreach ($data as $item) {
            $user = $item[0]->user;
            $params['[number]'][] = ++$number;
            $params['[staff]'][] = $user->full_name;
            $params['[store]'][] = $user->rankPositionInformation->store->name;
            $params['[role]'][] = $user->rankPositionInformation->position->name;

            $late_count = $late_key;
            $early_count = $early_key;
            foreach ($item as $value) {
                if (array_key_exists($value->time_config_type, $late_count)) {
                    $late_count[$value->time_config_type] = $value->count;
                }
                if (array_key_exists($value->time_config_type, $early_count)) {
                    $early_count[$value->time_config_type] = $value->count;
                }
            }
            $params['[[counting_late]]'][] = array_values($late_count);
            $params['[[counting_early]]'][] = array_values($early_count);
        }

        return $this->excelExporterServices->export('late-early', $params);
    }

    public function lateEarlyReportNew($attributes)
    {
        $users = User::with(['timekeeping'])->get();
        $date = !empty($attributes['date']) ? $attributes['date'] : Carbon::now()->format('Y-m-d');

        foreach ($users as $user) {
            $checkRankPosition = $user->listRankPositionInformationHistory->filter(function ($item) use ($date) {
                $start_date = $item->start_date->format('Y-m-d');
                $end_date = !is_null($item->end_date) ? $item->end_date->format('Y-m-d') : null;

                return ($start_date <= $date && $end_date >= $date) || ($start_date <= $date && $end_date == null);
            })->first();

            $userTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($user->id, $date, $date);

            if (!empty($userTimeWorkShift)) {
                $timeDeadline = $this->checkTimeAllow($date, end($userTimeWorkShift[$date]));
                $timekeepings = $user->timekeeping()->whereDate('attended_at', date($date))->get();

                $timeShift = [];
                $nowHours = !empty($attributes['time']) ? $attributes['time'] : Carbon::now()->format('H:i:ss');

                foreach ($userTimeWorkShift[$date] as $key => $value) {
                    $timeShift[] = $value['start_time'] . ' - ' . $value['end_time'];
                }

                $shift = Shift::findOrFail($userTimeWorkShift[$date][0]['shift_id']);

                foreach ($userTimeWorkShift[$date] as $key => $value) {

                    $timeAllow = $this->checkTimeAllow($date, $value);

                    $timeDeadlineLaterly = Config::where('code', 'TIMEKEEPING_DEADLINE')->first()->value;

                    $formatStartTime = Carbon::parse($date . '' . $value['start_time'])->addMinutes($timeDeadlineLaterly)->format('Y-m-d H:i:s');
                    $formatEndTime = Carbon::parse($date . '' . $value['end_time'])->format('Y-m-d H:i:s');
                    $startTime = Carbon::parse($date . '' . $value['start_time'])->addMinutes($timeDeadlineLaterly)->format('H:i:s');

                    // di trễ
                    if ($nowHours > $startTime) {
                        $typeLate = LateEarly::LATE;

                        if ($key >= 1) {
                            $timeAllow['validBeforeStartTime'] = Carbon::parse($date . '' . $value['start_time'])->subMinutes(Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME_SECOND')->first()->value)->toDateTimeString();
                        }

                        $timeKeepingAfterTimeStart = $user->timekeeping()
                            ->where([['attended_at', '>=', $timeAllow['validBeforeStartTime']], ['attended_at', '<=', $formatStartTime]])
                            ->where('user_id', $user->id)->get();

                        $timeKeepingBeforTimeStart = $user->timekeeping()
                            ->where([['attended_at', '<=', $timeAllow['validAfterStartTime']], ['attended_at', '>', $formatStartTime]])
                            ->where('user_id', $user->id)->orderBy('attended_at')->get();

                        if (empty(count($timeKeepingAfterTimeStart)) && !empty(count($timeKeepingBeforTimeStart))) {
                            //kiểm tra tồn tại đi trễ
                            $existLate = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($user, $date) {
                                $query->where('type', LateEarlyTimeConfig::LATE);
                            })->where('user_id', $user->id)
                                ->whereDate('date', $date)
                                ->whereIn('time_slot', [$value['start_time'] . '-' . $value['end_time']])
                                ->get();

                            if (empty(count($existLate))) {
                                $timeAttendLate = Carbon::parse($timeKeepingBeforTimeStart[0]->attended_at)->format('H:i:s');

                                $timeLate = strtotime($timeAttendLate) - strtotime($startTime);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['from_time', '<=', gmdate("H:i:s", ($timeLate))],
                                        ['to_time', '>=', gmdate("H:i:s", ($timeLate))],
                                    ]
                                )->where('type', $typeLate)->first();

                                $statusLate = $timeLate > $this->setTimeLate() ? LateEarly::AUTOMATIC_APPROVE : LateEarly::PENDING;

                                $dataLate = [
                                    'time_config_type' => $configLateEarly->id,
                                    'time' => gmdate("H:i:s", ($timeLate)),
                                    'date' => $date,
                                    'time_violation' => $timeAttendLate,
                                    'status' => $statusLate,
                                    'time_shift' => implode(',', $timeShift),
                                    'shift_code' => $shift->shift_code,
                                    'time_slot' => $value['start_time'] . '-' . $value['end_time'],
                                    'user_id' => $user->id,
                                    'work_store' => $shift->store_id,
                                    'store_id' => $checkRankPosition->store_id,
                                ];

                                $this->model->create($dataLate);
                            }
                        }
                    }

                    // về sớm
                    if ($nowHours > $value['end_time']) {
                        $typeEarly = LateEarly::EARLY;
                        $timeKeepingAfterTimeEnd = $user->timekeeping()
                            ->where([['attended_at', '>=', $timeAllow['validBeforeEndTime']], ['attended_at', '<', $formatEndTime]])
                            ->where('user_id', $user->id)->orderBy('attended_at')->get();

                        if (!empty(count($timeKeepingAfterTimeEnd))) {

                            //kiểm tra tồn tại về sớm
                            $existEarly = LateEarly::whereHas('lateEarlyConfig', function ($query) use ($user, $date) {
                                $query->where('type', LateEarlyTimeConfig::EARLY);
                            })->where('user_id', $user->id)
                                ->whereDate('date', $date)
                                ->whereIn('time_slot', [$value['start_time'] . '-' . $value['end_time']])
                                ->get();

                            if (empty(count($existEarly))) {

                                $timeAttendEarly = Carbon::parse($timeKeepingAfterTimeEnd[0]->attended_at)->format('H:i:s');

                                $timeEarly = strtotime($value['end_time']) - strtotime($timeAttendEarly);

                                $configLateEarly = LateEarlyTimeConfig::where(
                                    [
                                        ['from_time', '<=', gmdate("H:i:s", ($timeEarly))],
                                        ['to_time', '>=', gmdate("H:i:s", ($timeEarly))],
                                    ]
                                )->where('type', $typeEarly)->first();

                                $statusEarly = LateEarly::PENDING;

                                $dataLate = [
                                    'time_config_type' => $configLateEarly->id,
                                    'time' => gmdate("H:i:s", ($timeEarly)),
                                    'date' => $date,
                                    'time_violation' => $timeAttendEarly,
                                    'status' => $statusEarly,
                                    'time_shift' => implode(',', $timeShift),
                                    'shift_code' => $shift->shift_code,
                                    'time_slot' => $value['start_time'] . '-' . $value['end_time'],
                                    'user_id' => $user->id,
                                    'work_store' => $shift->store_id,
                                    'store_id' => $checkRankPosition->store_id,
                                ];

                                $this->model->create($dataLate);
                            }
                        }
                    }

                    // không xác định
                    // cham cong trong thoi gian khong xac dinh trong khung gio lam viec
                    $timekeepingInvalid = $user->timekeeping()
                        ->where([['attended_at', '>', $timeAllow['validAfterStartTime']], ['attended_at', '<', $timeAllow['validBeforeEndTime']]])
                        ->where('user_id', $user->id)
                        ->orderBy('attended_at')
                        ->get();

                    if (count($timekeepingInvalid) > 0) {
                        // TODO: kiem tra ton tai record Invalid
                        $existInvalid = LateEarly::where('user_id', $user->id)
                            ->where('status', LateEarly::INVALID)
                            ->whereDate('date', $date)
                            ->get();

                        if (count($existInvalid) == 0) {
                            $data['date'] = $date;
                            $data['user_id'] = $user->id;
                            $data['shift_code'] = $shift->shift_code;
                            $data['work_store'] = $shift->store_id;
                            $data['time_violation'] = Carbon::parse($timekeepingInvalid[0]->attended_at)->format('H:i:s');
                            $data['time_shift'] = implode(',', $timeShift);
                            $data['time_slot'] = $value['start_time'] . '-' . $value['end_time'];
                            $data['status'] = LateEarly::INVALID;
                            $data['store_id'] = $checkRankPosition->store_id;
                            $this->model->create($data);
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
        $minutesBeforeStart = Config::where('code', 'DURATION_ALLOW_BEFORE_STARTTIME')->first()->value;
        $minutesAfterStart = Config::where('code', 'DURATION_ALLOW_AFTERT_STARTTIME')->first()->value;
        $minutesBeforeEnd = Config::where('code', 'DURATION_ALLOW_BEFORE_ENDTIME')->first()->value;
        $minutesAfterEnd = Config::where('code', 'DURATION_ALLOW_AFTERT_ENDTIME')->first()->value;

        $durationAllow['validBeforeStartTime'] = !empty($item['start_time']) ? Carbon::parse($dateAttend . '' . $item['start_time'])->subMinutes($minutesBeforeStart)->toDateTimeString() : 0;
        $durationAllow['validAfterStartTime'] = !empty($item['start_time']) ? Carbon::parse($dateAttend . '' . $item['start_time'])->addMinutes($minutesAfterStart)->toDateTimeString() : 0;
        $durationAllow['validBeforeEndTime'] = !empty($item['end_time']) ? Carbon::parse($dateAttend . '' . $item['end_time'])->subMinutes($minutesBeforeEnd)->toDateTimeString() : 0;
        $durationAllow['validAfterEndTime'] = !empty($item['end_time']) ? Carbon::parse($dateAttend . '' . $item['end_time'])->addMinutes($minutesAfterEnd)->toDateTimeString() : 0;

        return $durationAllow;
    }

    /**
     * Set time late
     */
    public function setTimeLate()
    {
        return Config::where('code', 'TIME_LATE')->first()->value;
    }

    /**
     * get invalid Timekeeping
     * @param $attributes
     * @return \Illuminate\Config\Repository|mixed
     */
    public function invalidTimekeeping($attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
        }

        $this->model = $this->model->where('status', LateEarly::INVALID);

        if (!empty($attributes['user_id'])) {
            $this->model = $this->model->whereIn('user_id', explode(',', $attributes['user_id']));
        }

        if (!empty($attributes['status_work_declaration'])) {
            $statusWorkDeclaration = explode(',', $attributes['status_work_declaration']);
            $this->model = $this->model->whereIn('status_work_declaration', $statusWorkDeclaration);
        }

        $this->model = $this->model->whereHas('user', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        if (!empty($attributes['limit'])) {
            $users = $this->paginate($attributes['limit']);
        } else {
            $users = $this->get();
        }

        return $users;
    }
}
