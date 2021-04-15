<?php

namespace GGPHP\ResignationDecision\Repositories\Eloquent;

use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\ResignationDecision\Presenters\ResignationDecisionPresenter;
use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ResignationDecisionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ResignationDecisionRepositoryEloquent extends BaseRepository implements ResignationDecisionRepository
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
        return ResignationDecision::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ResignationDecisionPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getResignationDecision(array $attributes)
    {

        if (!empty($attributes['limit'])) {
            $resignationDecision = $this->paginate($attributes['limit']);
        } else {
            $resignationDecision = $this->get();
        }

        return $resignationDecision;
    }
}
