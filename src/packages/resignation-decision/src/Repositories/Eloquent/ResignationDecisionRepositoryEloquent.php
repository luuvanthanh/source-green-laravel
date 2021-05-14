<?php

namespace GGPHP\ResignationDecision\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\ResignationDecision\Presenters\ResignationDecisionPresenter;
use GGPHP\ResignationDecision\Repositories\Contracts\ResignationDecisionRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
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

    public function exportWord($id)
    {
        $resignationDecision = ResignationDecision::findOrFail($id);
        $now = Carbon::now();

        $employee = $resignationDecision->employee;
        $params = [
            'decisionNumber' => $resignationDecision->DecisionNumber,
            'decisionDate' => $resignationDecision->DecisionDate->format('d-m-Y'),
            'dateNow' => $now->format('d'),
            'monthNow' => $now->format('m'),
            'yearNow' => $now->format('Y'),
            'date' => $resignationDecision->DecisionDate->format('d'),
            'month' => $resignationDecision->DecisionDate->format('m'),
            'year' => $resignationDecision->DecisionDate->format('Y'),
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '       ',
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '       ',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
            'payEndDate' => $resignationDecision->PayEndDate ? $resignationDecision->PayEndDate->format('d-m-Y') : '       ',
        ];

        return $this->wordExporterServices->exportWord('resignation_decision', $params);
    }
}
