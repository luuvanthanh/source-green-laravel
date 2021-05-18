<?php

namespace GGPHP\DecisionSuspend\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\DecisionSuspend\Models\DecisionSuspend;
use GGPHP\DecisionSuspend\Presenters\DecisionSuspendPresenter;
use GGPHP\DecisionSuspend\Repositories\Contracts\DecisionSuspendRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DecisionSuspendRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DecisionSuspendRepositoryEloquent extends CoreRepositoryEloquent implements DecisionSuspendRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'DecisionNumber' => 'like',
        'EmployeeId',
        'Employee.FullName' => 'like',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
    }

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
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->where('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $decisionSuspend = $this->paginate($attributes['limit']);
        } else {
            $decisionSuspend = $this->get();
        }

        return $decisionSuspend;
    }

    public function exportWord($id)
    {
        $decisionSuspend = DecisionSuspend::findOrFail($id);
        $now = Carbon::now();

        $employee = $decisionSuspend->employee;
        $params = [
            'decisionNumber' => $decisionSuspend->DecisionNumber,
            'decisionDate' => $decisionSuspend->DecisionDate->format('d-m-Y'),
            'dateNow' => $now->format('d'),
            'monthNow' => $now->format('m'),
            'yearNow' => $now->format('Y'),
            'date' => $decisionSuspend->DecisionDate->format('d'),
            'month' => $decisionSuspend->DecisionDate->format('m'),
            'year' => $decisionSuspend->DecisionDate->format('Y'),
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '       ',
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '       ',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
            'from' => $decisionSuspend->From ? $decisionSuspend->From->format('d-m-Y') : '       ',
            'to' => $decisionSuspend->To ? $decisionSuspend->To->format('d-m-Y') : '       ',
            'prohibit' => $decisionSuspend->Prohibit ? $decisionSuspend->Prohibit : '       ',
        ];

        return $this->wordExporterServices->exportWord('decision_suspend', $params);
    }
}
