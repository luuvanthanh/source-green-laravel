<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Presenters\AbsentPresenter;
use GGPHP\Absent\Repositories\Absent\AbsentRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Auth;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends BaseRepository implements AbsentRepository
{
    protected $userRepositoryEloquent, $excelExporterServices;

    public function __construct(
        UserRepositoryEloquent $userRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->userRepositoryEloquent = $userRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'store_id',
        'status',
        'absent_type_id',
        'absent_reason_id',
        'user.full_name' => 'like',
        'sabbaticalLeave',
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
        if (!$parse) {
            $this->skipPresenter();
        }

        $this->model = $this->model->query();

        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('status', explode(',', $attributes['status']));
        }

        // filter theo loai nghi viec (QUIT_WORK)
        if (!empty($attributes['type'])) {

            $type = AbsentType::where('type', $attributes['type'])->first();
            if ($type) {
                $this->model->wherehas('absentType', function ($q) use ($type) {
                    $q->where('id', $type->id);
                });
            }

            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $this->model = $this->model->where(function ($q2) use ($attributes) {
                    $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                        ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                        ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
                });
            }
        } elseif (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {

            // Kiosk - de xuat, tra cuu
            if (!empty($attributes['filterType']) && $attributes['filterType'] == $this->model()::KIOSK_FILTER_DE_XUAT) {
                $this->model = $this->model->where('owner_id', Auth::id())
                    ->where([['created_at', '>=', $attributes['start_date']], ['created_at', '<=', $attributes['end_date']]]);
            } elseif (!empty($attributes['filterType']) && $attributes['filterType'] == $this->model()::KIOSK_FILTER_TRA_CUU && !empty($attributes['user_id'])) {
                // tra cuu nghi phep ca nhan
                $this->model = $this->model->where('user_id', $attributes['user_id'])
                    ->where(function ($q2) use ($attributes) {
                        $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                            ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                            ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
                    })
                    ->with('absentType')->approved();

            } elseif (!empty($attributes['filterType']) && $attributes['filterType'] == $this->model()::KIOSK_FILTER_OFF && !empty($attributes['user_id'])) {
                // tra cuu nghi off ca nhan
                $this->model = $this->model->where('user_id', $attributes['user_id'])->where('absent_type_id', 4)
                    ->where(function ($q2) use ($attributes) {
                        $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                            ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                            ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
                    });
            } else {
                // webapp, without loai: nghi viec
                $type = AbsentType::where('type', AbsentType::QUIT_WORK)->first();
                if ($type) {
                    $this->model->whereDoesntHave('absentType', function ($q) use ($type) {
                        $q->where('id', $type->id);
                    });
                }

                $this->model = $this->model->where(function ($q2) use ($attributes) {
                    $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                        ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                        ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
                });
            }

        }

        if (empty($attributes['filterType']) || (!empty($attributes['filterType']) && $attributes['filterType'] != $this->model()::KIOSK_FILTER_OFF)) {
            $this->model = $this->model->whereNotIn('absent_type_id', [4, 5, 6, 7]);
        }

        if (!empty($attributes['limit'])) {
            $absents = $this->paginate($attributes['limit']);
        } else {
            $absents = $this->get();
        }

        return $absents;
    }

    /**
     *  Get absent without leave
     * @param $attributes
     * @return mixed
     */
    public function filterAbsentWithoutLeave($attributes)
    {
        $this->model = $this->model->query();

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $type = AbsentType::where('type', AbsentType::AWOL)->first();
            if ($type) {
                $this->model->where(function ($q2) use ($attributes) {
                    $q2->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                        ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                        ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
                })->whereIn('absent_type_id', [$type->id]);
            }
        }

        if (!empty($attributes['user_id'])) {
            $this->model->where('user_id', $attributes['user_id']);
        }

        if (!empty($attributes['limit'])) {
            $absents = $this->paginate($attributes['limit']);
        } else {
            $absents = $this->get();
        }

        return $absents;
    }

    /**
     * @param  array $attributes
     * @return object
     */
    public function export($request)
    {
        $results = $this->filterAbsent($request->all(), false);

        $params = [];
        $params['{start_date}'] = Carbon::parse($request->start_date)->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($request->end_date)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[createdAt]'] = [];
        $params['[createUserName]'] = [];
        $params['[targetUserName]'] = [];
        $params['[store]'] = [];
        $params['[efficiencyAt]'] = [];
        $params['[status]'] = [];

        foreach ($results as $key => $absent) {
            $params['[number]'][] = ++$key;
            $params['[createdAt]'][] = $absent->created_at->format('d-m-Y H:m:s') ?? '';
            $params['[createUserName]'][] = $absent->owner->full_name ?? '';
            $params['[targetUserName]'][] = $absent->user->full_name ?? '';
            $params['[store]'][] = $absent->store->name ?? '';
            $params['[efficiencyAt]'][] = $absent->start_date->format('d-m-Y') ?? '';
            $params['[status]'][] = $this->excelExporterServices->getPlaceText($absent->approvalRequest->currentPlace);
        }

        return $this->excelExporterServices->export('absents', $params);
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getAbsent($attributes, $parse = true)
    {
        if (!$parse) {
            $this->userRepositoryEloquent->skipPresenter();
        }
        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->query();

        if (!empty($attributes['is_absent'])) {
            $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->whereHas('absent', function ($query) use ($attributes) {
                if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                    $query->whereDate('start_date', '>=', $attributes['start_date'])->whereDate('start_date', '<=', $attributes['end_date']);
                }

                if (!empty($attributes['absent_type_id'])) {
                    $query->where('absent_type_id', $attributes['absent_type_id']);
                }

                $query->whereNotIn('absent_type_id', [1, 3, 5, 6, 7]);

                $query->approved();

            });
        }

        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
                $query->whereDate('start_date', '>=', $attributes['start_date'])->whereDate('start_date', '<=', $attributes['end_date']);
            }

            if (!empty($attributes['absent_type_id'])) {
                $query->where('absent_type_id', $attributes['absent_type_id']);
            }

        }]);

        if (!empty($attributes['user_id'])) {
            $this->userRepositoryEloquent->model->whereIn('id', explode(',', $attributes['user_id']));
        }

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
    public function absentByUserExport($request)
    {
        $results = $this->getAbsent($request->all(), false);

        $params = [];
        $params['{start_date}'] = Carbon::parse($request->start_date)->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($request->end_date)->format('d-m-Y');
        $params['[number]'] = [];
        $params['[userName]'] = [];
        $params['[store]'] = [];
        $params['[position]'] = [];

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[userName]'][] = $user->full_name;
            $params['[store]'][] = $user->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $user->rankPositionInformation->position->name ?? '';

            // Absent calculator
            if ($request->type === 'month') {
                $params['[annualLeave]'][] = $user->calculatorAbsent($request->start_date, $request->end_date, AbsentType::ANNUAL_LEAVE);
                $params['[unpaidLeave]'][] = $user->calculatorAbsent($request->start_date, $request->end_date, AbsentType::UNPAID_LEAVE);
                $params['[awolLeave]'][] = $user->calculatorAbsent($request->start_date, $request->end_date, AbsentType::AWOL);
            } elseif ($request->type === 'year') {
                $absentYear = $user->countAbsents($request->start_date, $request->end_date);

                $year = Carbon::parse($request->start_date)->format('Y');
                for ($i = 1; $i <= 12; $i++) {
                    $monthOfYear = $year . '-' . sprintf('%02d', $i);
                    $params["[annualLeave$i]"][] = $absentYear['resultAbsents'][$monthOfYear]['absents'];
                    $params["[unpaidLeave$i]"][] = $absentYear['resultAbsents'][$monthOfYear]['unpaids'];
                    $params["[awolLeave$i]"][] = $absentYear['resultAbsents'][$monthOfYear]['awol'];
                }

                $params['[annualLeave]'][] = $absentYear['annualAbsent'];
                $params['[unpaidLeave]'][] = $absentYear['unpaidLeave'];
                $params['[remaining]'][] = $absentYear['remaining'];
                $params['[awolLeave]'][] = $absentYear['awolLeave'];
            }
        }

        return $this->excelExporterServices->export('absents-by-user-' . $request->type, $params);
    }

    /**
     * @param  array $attributes
     * @return object
     */
    public function absentsAwolExport(array $attributes)
    {
        $type = AbsentType::where('type', AbsentType::AWOL)->first();

        $awolId = $type->id;
        $params = [];
        $params['{start_date}'] = Carbon::parse($attributes['start_date'])->format('d-m-Y');
        $params['{end_date}'] = Carbon::parse($attributes['end_date'])->format('d-m-Y');

        $query = User::whereHas('absent', function ($query) use ($attributes, $awolId) {
            $query->where(function ($queryTime) use ($attributes) {
                $queryTime->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                    ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                    ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
            })->where('absent_type_id', $awolId);
        })->with(['absent' => function ($query) use ($attributes, $awolId) {
            $query->where(function ($queryTime) use ($attributes) {
                $queryTime->where([['start_date', '<=', $attributes['start_date']], ['end_date', '>=', $attributes['end_date']]])
                    ->orWhere([['start_date', '>=', $attributes['start_date']], ['start_date', '<=', $attributes['end_date']]])
                    ->orWhere([['end_date', '>=', $attributes['start_date']], ['end_date', '<=', $attributes['end_date']]]);
            })->where('absent_type_id', $awolId);
        }]);

        if (!empty($attributes['full_name'])) {
            $query->where('full_name', 'like', '%' . $attributes['full_name'] . '%');
        }
        if (!empty($attributes['store_id'])) {
            $query->whereHas('rankPositionInformation', function ($q) use ($attributes) {
                $q->where('store_id', $attributes['store_id']);
            });
        }

        $query->where('status', 'ON');

        $users = $query->get();
        foreach ($users as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[staff]'][] = $user->full_name;
            $params['[store]'][] = $user->rankPositionInformation->store->name ?? '';
            $params['[position]'][] = $user->rankPositionInformation->position->name ?? '';

            $absentAwol = $user->absent;
            $absentCount = 0;
            $listDate = [];
            if (!empty(count($absentAwol))) {
                foreach ($absentAwol as $value) {
                    $startDate = Carbon::parse($attributes['start_date']);
                    $endDate = Carbon::parse($attributes['end_date']);

                    if ($value->start_date < $startDate) {
                        $period = CarbonPeriod::create($startDate, $value->end_date);
                        foreach ($period as $date) {
                            $listDate[] = $date->format('d-m-Y');
                        }

                        $absentCount += $value->end_date->diffInDays($startDate) + 1;
                        break;
                    }

                    if ($value->end_date > $endDate) {
                        $period = CarbonPeriod::create($value->start_date, $endDate);
                        foreach ($period as $date) {
                            $listDate[] = $date->format('d-m-Y');
                        }

                        $absentCount += $endDate->diffInDays($value->start_date) + 1;
                        break;
                    }

                    $period = CarbonPeriod::create($value->start_date, $value->end_date);
                    foreach ($period as $date) {
                        $listDate[] = $date->format('d-m-Y');
                    }
                    $absentCount += $value->end_date->diffInDays($value->start_date) + 1;
                }
            }
            $params['[absent_count]'][] = $absentCount;
            $params['[absent_detail]'][] = implode(', ', $listDate);
        }

        return $this->excelExporterServices->export('absent_awol', $params);
    }
}
