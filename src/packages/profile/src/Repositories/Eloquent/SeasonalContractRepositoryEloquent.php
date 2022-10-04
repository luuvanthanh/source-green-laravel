<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\ParamaterValue;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Repositories\Eloquent\PositionLevelRepositoryEloquent;
use GGPHP\Profile\Models\SeasonalContract;
use GGPHP\Profile\Presenters\SeasonalContractPresenter;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\Profile\Repositories\Contracts\SeasonalContractRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\Storage;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class LabourContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SeasonalContractRepositoryEloquent extends CoreRepositoryEloquent implements SeasonalContractRepository
{
    protected $wordExporterServices;

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'employee.FullName' => 'like',
        'CreationTime',
    ];

    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        WordExporterServices $wordExporterServices,
        PositionLevelRepositoryEloquent $positionLevelRepository,
        ScheduleRepositoryEloquent $scheduleRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->positionLevelRepository = $positionLevelRepository;
        $this->wordExporterServices = $wordExporterServices;
        $this->scheduleRepositoryEloquent = $scheduleRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SeasonalContract::class;
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
        return SeasonalContractPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['typeOfContractId'])) {
            $typeOfContractId = explode(',', $attributes['typeOfContractId']);
            $this->model = $this->model->whereIn('TypeOfContractId', $typeOfContractId);
        }

        if (!empty($attributes['branchId'])) {
            $branchId = explode(',', $attributes['branchId']);
            $this->model = $this->model->whereIn('BranchId', $branchId);
        }

        if (!empty($attributes['positionId'])) {
            $positionId = explode(',', $attributes['positionId']);
            $this->model = $this->model->whereIn('PositionId', $positionId);
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('ContractDate', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('ContractDate', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }

        if (!empty($attributes['limit'])) {
            $seasonalContract = $this->paginate($attributes['limit']);
        } else {
            $seasonalContract = $this->get();
        }

        return $seasonalContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $seasonalContract = SeasonalContract::create($attributes);

            resolve(LabourContractRepository::class)->created($seasonalContract, $attributes);

            foreach ($attributes['detail'] as $value) {
                $seasonalContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return $this->parserResult($seasonalContract);
    }

    public function update(array $attributes, $id)
    {
        $seasonalContract = SeasonalContract::findOrFail($id);
        \DB::beginTransaction();
        try {
            $seasonalContract->update($attributes);

            resolve(LabourContractRepository::class)->updated($seasonalContract->refresh(), $attributes);

            $seasonalContract->parameterValues()->detach();

            foreach ($attributes['detail'] as $value) {
                $seasonalContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return $this->parserResult($seasonalContract);
    }


    public function delete($id)
    {
        $seasonalContract = SeasonalContract::findOrFail($id);

        $seasonalContract->parameterValues()->detach();

        return $seasonalContract->delete();
    }

    public function exportWord($id, $response = null)
    {
        $labourContract = SeasonalContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $salary = $labourContract->BasicSalary;
        $allowance =  $labourContract->TotalAllowance;

        $total = $salary + $allowance;
        $employee = $labourContract->employee;
        $params = [
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? ($employee->PlaceOfIssueIdCard) : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            // 'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'month' => $labourContract->Month ? $labourContract->Month : '........',
            'salaryRatio' => $labourContract->SalaryRatio ? $labourContract->SalaryRatio : '........',
            'from' => $labourContract->ContractFrom ? 'ngày ' . $labourContract->ContractFrom->format('d') . ' tháng ' . $labourContract->ContractFrom->format('m') . ' năm ' . $labourContract->ContractFrom->format('Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'positionDivision' => $labourContract->position && $labourContract->division ? $labourContract->position->Name . ' - ' . $labourContract->division->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Address : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($salary),
            'allowance' => number_format($allowance),
            'total' => number_format($total),
        ];

        return $this->wordExporterServices->exportWord('labour_contract', $params, $response);
    }


    public function exportWordEnglish($id)
    {
        $labourContract = SeasonalContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
            'typeVn' => 'THỜI VỤ',
            'typeEnglish' => 'SEASONAL',
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? $employee->PlaceOfIssueIdCard : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'position' => $labourContract->position ? $labourContract->position->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($labourContract->BasicSalary),
        ];

        return $this->wordExporterServices->exportWord('contract_english', $params);
    }

    public function exportWordAuthority($id)
    {
        $labourContract = SeasonalContract::findOrFail($id);
        $contractNumber = !is_null($labourContract->ContractNumber) ? $labourContract->ContractNumber : $labourContract->OrdinalNumber . '/' . $labourContract->NumberForm;

        $employee = $labourContract->employee;
        $params = [
            'typeVn' => 'THỜI VỤ',
            'typeEnglish' => 'SEASONAL',
            'contractNumber' => $contractNumber,
            'dateNow' => $labourContract->ContractDate->format('d'),
            'monthNow' => $labourContract->ContractDate->format('m'),
            'yearNow' => $labourContract->ContractDate->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '........',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '........',
            'fullName' => $employee->FullName ? $employee->FullName : '........',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '........',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '........',
            'nationality' => $employee->Nationality ? $employee->Nationality : '........',
            'idCard' => $employee->IdCard ? $employee->IdCard : '........',
            'dateOfIssueCard' => $employee->DateOfIssueIdCard ? $employee->DateOfIssueIdCard->format('d-m-Y') : '........',
            'placeOfIssueCard' => $employee->PlaceOfIssueIdCard ? $employee->PlaceOfIssueIdCard : '........',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '........',
            'adress' => $employee->Address ? $employee->Address : '.......',
            'phone' => $employee->PhoneNumber ? $employee->PhoneNumber : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '........',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '........',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '........',
            'position' => $labourContract->position ? $labourContract->position->Name : '........',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '........',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => number_format($labourContract->BasicSalary),
            'represent_name' => $labourContract->represent ? $labourContract->represent->FullName : '',
        ];

        return $this->wordExporterServices->exportWord('authority_contract', $params);
    }

    public function previewSeasonalContractExportWord($id)
    {
        $seasonalContract = SeasonalContract::findOrFail($id);
        $fileName = $seasonalContract->Id . '.docx';
        $filePath = $this->exportWord($id, 'url');
        $file = Storage::disk('local')->get($filePath);

        Storage::disk('local')->put('public/files/' . $fileName, $file);

        return [
            'data' => [
                'url' => env('URL_FILE') . $fileName
            ]
        ];
    }
}
