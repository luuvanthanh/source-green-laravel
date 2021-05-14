<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Profile\Presenters\ProbationaryContractPresenter;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProbationaryContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ProbationaryContractRepositoryEloquent extends CoreRepositoryEloquent implements ProbationaryContractRepository
{

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
        return ProbationaryContract::class;
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
        return ProbationaryContractPresenter::class;
    }

    public function getProbationaryContract(array $attributes)
    {
        if (!empty($attributes['status'])) {

            switch ($attributes['status']) {
                case 'DANG_HIEU_LUC':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractFrom', '<=', $now->format('Y-m-d'))->where('ContractTo', '>', $addMonth->format('Y-m-d'));
                    break;
                case 'GAN_HET_HAN':
                    $now = Carbon::now();
                    $addMonth = Carbon::now()->addMonth();

                    $this->model = $this->model->where('ContractTo', '>=', $now->format('Y-m-d'))->where('ContractTo', '<=', $addMonth->format('Y-m-d'));
                    break;
                case 'DA_HET_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractTo', '<', $now->format('Y-m-d'));
                    break;
                case 'CHUA_DEN_HAN':
                    $now = Carbon::now();

                    $this->model = $this->model->where('ContractFrom', '>', $now->format('Y-m-d'));
                    break;
                default:
                    break;
            }
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where('ContractDate', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('ContractDate', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }

        if (!empty($attributes['limit'])) {
            $probationaryContract = $this->paginate($attributes['limit']);
        } else {
            $probationaryContract = $this->get();
        }

        return $probationaryContract;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $probationaryContract = ProbationaryContract::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($probationaryContract->Id);
    }

    public function update(array $attributes, $id)
    {
        $probationaryContract = ProbationaryContract::findOrFail($id);

        \DB::beginTransaction();
        try {
            $probationaryContract->update($attributes);

            $probationaryContract->parameterValues()->detach();
            foreach ($attributes['detail'] as $value) {
                $probationaryContract->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($probationaryContract->Id);
    }

    public function exportWord($id)
    {
        $labourContract = ProbationaryContract::findOrFail($id);
        $now = Carbon::now();

        $employee = $labourContract->employee;
        $params = [
            'contractNumber' => $labourContract->ContractNumber,
            'dateNow' => $now->format('d'),
            'monthNow' => $now->format('m'),
            'yearNow' => $now->format('Y'),
            'adressCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Address : '       ',
            'phoneCompany' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->PhoneNumber : '       ',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
            'birthday' => $employee->DateOfBirth ? $employee->DateOfBirth->format('d-m-Y') : '       ',
            'placeOfBirth' => $employee->PlaceOfBirth ? $employee->PlaceOfBirth : '       ',
            'nationality' => $employee->Nationality ? $employee->Nationality : '       ',
            'idCard' => $employee->IdCard ? $employee->IdCard : '       ',
            'dateOfIssueCard' => $employee->DateOfIssueCard ? $employee->DateOfIssueCard->format('d-m-Y') : '       ',
            'placeOfIssueCard' => $employee->PlaceOfIssueCard ? $employee->PlaceOfIssueCard : '       ',
            'permanentAddress' => $employee->PermanentAddress ? $employee->PermanentAddress : '       ',
            'adress' => $employee->Adress ? $employee->Adress : '.......',
            // 'phone' => $employee->Phone ? $employee->Phone : '.......',
            'typeContract' => $labourContract->typeOfContract ? $labourContract->typeOfContract->Name : '       ',
            'month' => $labourContract->Month ? $labourContract->Month : '       ',
            'from' => $labourContract->ContractFrom ? $labourContract->ContractFrom->format('d-m-Y') : '       ',
            'to' => $labourContract->ContractTo ? $labourContract->ContractTo->format('d-m-Y') : '       ',
            'position' => $labourContract->position ? $labourContract->position->Name : '       ',
            'branchWord' => $labourContract->branch ? $labourContract->branch->Name : '       ',
            'workTime' => $labourContract->WorkTime ? $labourContract->WorkTime : '.......',
            'salary' => $labourContract->parameterValues->where('Code', 'LUONG')->first()->pivot->Value,
        ];

        return $this->wordExporterServices->exportWord('probationary_contract', $params);
    }
}
