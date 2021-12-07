<?php

namespace GGPHP\ActivityLog\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\ActivityLog\Models\ActivityLog;
use GGPHP\ActivityLog\Presenters\ActivityLogPresenter;
use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

class ActivityLogRepositoryEloquent extends BaseRepository implements ActivityLogRepository
{
    protected $userRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $userRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->userRepositoryEloquent = $userRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ActivityLog::class;
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
        return ActivityLogPresenter::class;
    }

    public function filterAcitivity($attributes, $parse = true)
    {
        if (!empty($attributes['user_name'])) {
            $user = User::where('full_name', 'like', "%{$attributes['user_name']}%")->get()->pluck('id')->toArray();
            $this->model = $this->model->whereIn('causer_id', $user);
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!$parse) {
            return $this->model->get();
        }

        if (!empty($attributes['limit'])) {
            $activities = $this->paginate($attributes['limit']);
        } else {
            $activities = $this->get();
        }

        return $activities;
    }

    public function exportExcel($attributes)
    {
        $activities = $this->filterAcitivity($attributes, false);


        $params = [];
        $models = config('constants-activity.MODEL_COLLECTIONS');

        foreach ($activities as $key => $activitie) {
            $function = array_key_exists($activitie->subject_type, $models) ? $models[$activitie->subject_type] : $activitie->subject_type;

            $action = config('constants-activity.ACTION_COLLECTIONS')[$activitie->description];

            $params['[number]'][] = ++$key;
            $params['[date]'][] = !is_null($activitie->created_at) ? Carbon::parse($activitie->created_at)->format('d-m-Y') : null;
            $params['[full_name]'][] = !is_null($activitie->causer) ? $activitie->causer->full_name : null;
            $params['[function]'][] = $function;
            $params['[action]'][] = $action;
        }

        return  resolve(ExcelExporterServices::class)->export('activity_log', $params);
    }
}
