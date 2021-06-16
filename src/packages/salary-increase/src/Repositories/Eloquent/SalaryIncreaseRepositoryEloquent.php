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
            $salaryIncrease = SalaryIncrease::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $salaryIncrease->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($salaryIncrease->Id);
    }

    public function update(array $attributes, $id)
    {
        $salaryIncrease = SalaryIncrease::findOrFail($id);
        \DB::beginTransaction();
        try {
            $salaryIncrease->update($attributes);

            if (!empty($attributes['detail'])) {
                $salaryIncrease->parameterValues()->detach();

                foreach ($attributes['detail'] as $value) {
                    $salaryIncrease->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
                }
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($salaryIncrease->Id);
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

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
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

        $salary = $salaryIncrease->parameterValues->where('Code', 'LUONG')->first() ? $salaryIncrease->parameterValues->where('Code', 'LUONG')->first()->pivot->Value : 0;
        $allowance = $salaryIncrease->parameterValues->where('Code', 'PHU_CAP')->first() ? $salaryIncrease->parameterValues->where('Code', 'PHU_CAP')->first()->pivot->Value : 0;

        $total = $salary + $allowance;

        $params = [
            'decisionNumber' => $salaryIncrease->DecisionNumber,
            'decisionDate' => $salaryIncrease->DecisionDate ? $salaryIncrease->DecisionDate->format('d-m-Y') : '.......',
            'timeApply' => $salaryIncrease->TimeApply ? $salaryIncrease->TimeApply->format('d-m-Y') : '.......',
            'dateNow' => $salaryIncrease->DecisionDate ? $salaryIncrease->DecisionDate->format('d') : '.......',
            'monthNow' => $salaryIncrease->DecisionDate ? $salaryIncrease->DecisionDate->format('m') : '.......',
            'yearNow' => $salaryIncrease->DecisionDate ? $salaryIncrease->DecisionDate->format('Y') : '.......',
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '........',
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'total' => number_format((int) $total),
            'salaryOld' => number_format((int) $oldSalary),
            'salatyNew' => number_format((int) $salary),
            'allowance' => number_format((int) $allowance),
        ];

        return $this->wordExporterServices->exportWord('salary_increase', $params);
    }

    public function delete($id)
    {
        $appoint = SalaryIncrease::findOrFail($id);

        $appoint->parameterValues()->detach();

        return $appoint->delete();
    }
}
