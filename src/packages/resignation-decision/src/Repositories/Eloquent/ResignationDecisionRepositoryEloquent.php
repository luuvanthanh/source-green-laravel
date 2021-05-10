<?php

namespace GGPHP\ResignationDecision\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\ResignationDecision\Presenters\ResignationDecisionPresenter;
use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use \GGPHP\Users\Models\User;

/**
 * Class ResignationDecisionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ResignationDecisionRepositoryEloquent extends CoreRepositoryEloquent implements ResignationDecisionRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'DecisionNumber' => 'like',
        'EmployeeId',
        'Employee.FullName' => 'like',

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
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $resignationDecision = $this->paginate($attributes['limit']);
        } else {
            $resignationDecision = $this->get();
        }

        return $resignationDecision;
    }

    public function create(array $attributes)
    {
        $resignationDecision = ResignationDecision::create($attributes);

        $employee = User::where('Id', $attributes['employeeId'])->update(['DateOff' => $attributes['DateOff']]);

        return parent::find($resignationDecision->Id);
    }
}
