<?php

namespace GGPHP\ActivityLog\Repositories\Eloquent;

use GGPHP\ActivityLog\Models\ActivityLog;
use GGPHP\ActivityLog\Presenters\ActivityLogPresenter;
use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\CrmService;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ActivityLogRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ActivityLogRepositoryEloquent extends CoreRepositoryEloquent implements ActivityLogRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
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
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ActivityLogPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getActivityLog(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $activityLog = $this->paginate($attributes['limit']);
        } else {
            $activityLog = $this->get();
        }

        return $activityLog;
    }

    public function create(array $attributes)
    {
        $activityLog = $this->model()::create($attributes);

        return parent::parserResult($activityLog);
    }
}
