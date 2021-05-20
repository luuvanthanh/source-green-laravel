<?php

namespace GGPHP\SalaryIncrease\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\SalaryIncrease\Presenters\SalaryIncreasePresenter;
use GGPHP\SalaryIncrease\Repositories\Contracts\SalaryIncreaseRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class SalaryIncreaseRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SalaryIncreaseRepositoryEloquent extends CoreRepositoryEloquent implements SalaryIncreaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
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
        return SalaryIncrease::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return SalaryIncreasePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $tranfer = SalaryIncrease::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $tranfer->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getSalaryIncrease(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $salaryIncrease = $this->paginate($attributes['limit']);
        } else {
            $salaryIncrease = $this->get();
        }

        return $salaryIncrease;
    }

    public function exportWord($id)
    {
        $salaryIncrease = SalaryIncrease::findOrFail($id);
        $now = Carbon::now();

        $employee = $salaryIncrease->employee;
        $probationaryContract = $employee->probationaryContract->last();
        $labourContract = $employee->labourContract->last();
        $oldSalary = is_null($labourContract) ?
        is_null($probationaryContract) ? '......' : $probationaryContract->parameterValues->where('Code', 'LUONG')->first()->pivot->Value
        : $labourContract->parameterValues->where('Code', 'LUONG')->first()->pivot->Value;

        $params = [
            'decisionNumber' => $salaryIncrease->DecisionNumber,
            'decisionDate' => $salaryIncrease->DecisionDate->format('d-m-Y'),
            'dateNow' => $now->format('d'),
            'monthNow' => $now->format('m'),
            'yearNow' => $now->format('Y'),
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '       ',
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '       ',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
            'salary' => $salaryIncrease->parameterValues->where('Code', 'LUONG')->first()->pivot->Value,
            'salaryOld' => $oldSalary,
            'salatyNew' => $salaryIncrease->parameterValues->where('Code', 'LUONG')->first()->pivot->Value,
            'allowance' => $salaryIncrease->parameterValues->where('Code', 'PHU_CAP')->first()->pivot->Value,
        ];

        return $this->wordExporterServices->exportWord('salary_increase', $params);
    }
}
