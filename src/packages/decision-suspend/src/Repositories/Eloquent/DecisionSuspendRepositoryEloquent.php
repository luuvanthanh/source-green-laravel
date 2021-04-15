<?php

namespace GGPHP\DecisionSuspend\Repositories\Eloquent;

use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use GGPHP\DecisionSuspend\Presenters\DecisionSuspendPresenter;
use GGPHP\DecisionSuspend\Repositories\Contracts\DecisionSuspendRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class DecisionSuspendRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DecisionSuspendRepositoryEloquent extends BaseRepository implements DecisionSuspendRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'DecisionNumber' => 'like',
        'EmployeeId',
        'employee.full_name' => 'like',

    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return DecisionSuspend::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DecisionSuspendPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getDecisionSuspend(array $attributes)
    {

        if (!empty($attributes['limit'])) {
            $decisionSuspend = $this->paginate($attributes['limit']);
        } else {
            $decisionSuspend = $this->get();
        }

        return $decisionSuspend;
    }
}
