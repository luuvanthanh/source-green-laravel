<?php

namespace GGPHP\Crm\CallCenter\Repositories\Eloquent;

use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CallCenter\Presenters\CallCenterPresenter;
use GGPHP\Crm\CallCenter\Repositories\Contracts\CallCenterRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CallCenterRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CallCenterRepositoryEloquent extends BaseRepository implements CallCenterRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return HistoryCall::class;
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
        return CallCenterPresenter::class;
    }

    public function getCallCenter(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $callCenter = $this->paginate($attributes['limit']);
        } else {
            $callCenter = $this->get();
        }

        return $callCenter;
    }
}
