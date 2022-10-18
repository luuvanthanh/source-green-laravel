<?php

namespace GGPHP\Users\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Appoint\Models\Appoint;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Category\Models\Position;
use GGPHP\Config\Models\ConfigNotification;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\AccountantService;
use GGPHP\Core\Services\CrmService;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Reward\Models\DecisionReward;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\Transfer\Models\Transfer;
use GGPHP\Users\Models\User;
use GGPHP\Users\Presenters\UserPresenter;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Support\Str;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Container\Container as Application;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class UserRepositoryEloquent extends CoreRepositoryEloquent implements UserRepository
{
    /**
     * @param Application $app
     * @param ExcelExporterServices $wordExporterServices
     */
    public function __construct(
        Application $app,
        ExcelExporterServices $excelExporterServices
    ) {
        parent::__construct($app);
        $this->excelExporterServices = $excelExporterServices;
    }

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
        'FullName' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return User::class;
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
        return UserPresenter::class;
    }

    public function getUser($attributes, $report = false)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('Id', $employeeId);
        }

        if (!empty($attributes['classId'])) {

            $this->model = $this->model->whereHas('classTeacher', function ($query) use ($attributes) {
                $query->where('ClassId', $attributes['classId']);
            });
        }

        if (!empty($attributes['hasClass'])) {
            if ($attributes['hasClass'] == 'true') {
                $this->model = $this->model->whereHas('classTeacher');
            } else {
                $this->model = $this->model->whereDoesnthave('classTeacher');
            }
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereLike('FullName', $attributes['fullName']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->where('Status', $attributes['status']);
        } else {
            $this->model = $this->model->status(User::STATUS['WORKING']);
        }

        if (!empty($attributes['branchId']) && !empty($attributes['forManualCalculation']) && $attributes['forManualCalculation'] == true) {
            $this->model = $this->model->whereHas('positionLevelNow', function ($query) use ($attributes) {
                $query->where('BranchId', $attributes['branchId']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate']) && !empty($attributes['forManualCalculation']) && $attributes['forManualCalculation'] == true) {
            $this->model = $this->model->with(['manualCalculation' => function ($query) use ($attributes) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            }]);
        }

        $this->model = $this->model->tranferHistory($attributes);

        if (!empty($attributes['startDate']) && !empty($attributes['getLimitUser']) && $attributes['getLimitUser'] == true) {
            $this->model = $this->model->whereHas('labourContract', function ($query01) use ($attributes) {
                $query01->where(function ($q2) use ($attributes) {
                    $q2->where([['ContractFrom', '<=', $attributes['startDate']], ['ContractTo', '>=', $attributes['startDate']]])->where('IsEffect', true);
                });
            })->orWhereHas('labourContract.typeOfContract', function ($query02) {
                $query02->where('IsUnlimited', true);
            })->orWhereHas('probationaryContract', function ($query03) use ($attributes) {
                $query03->where(function ($q2) use ($attributes) {
                    $q2->where([['ContractFrom', '<=', $attributes['startDate']], ['ContractTo', '>=', $attributes['startDate']]])->where('IsEffect', true);
                });
            });
        }

        if (!empty('timekeeping')) {
            $this->model = $this->model->when(!empty($attributes['endDate']), function ($query) use ($attributes) {
                $arr = explode('-', $attributes['endDate']);
                $year = $arr[0];
                $month = $arr[1];

                return $query->where(function ($query) use ($year, $month) {
                    $query->whereDoesntHave('labourContract', function ($query) use ($year, $month) {
                        $query->whereYear('ContractTo', '<', $year)->whereMonth('ContractTo', '<', $month);
                    })->whereDoesntHave('probationaryContract', function ($query) use ($year, $month) {
                        $query->whereYear('ContractTo', '<', $year)->whereMonth('ContractTo', '<', $month);
                    })->whereDoesntHave('resignationDecision', function ($query) use ($year, $month) {
                        $query->whereYear('TimeApply', '<', $year)->whereMonth('TimeApply', '<', $month);
                    });
                });
            });
        }

        if (!empty($attributes['dateApply'])) {
            $this->model = $this->model->whereHas('authorizedPerson', function ($query) use ($attributes) {
                $now = Carbon::now();
                $query->whereDate('DateApply', '<=', $now->format('Y-m-d'));
                $query->whereDate('DateApply', '<=', $attributes['dateApply']);
                $query->where('IsEffect', true);
            });
        }

        if (!empty($attributes['divisionCode'])) {
            $arr = explode(',', $attributes['divisionCode']);
            $this->model = $this->model->whereHas('positionLevelNow.division', function ($query) use ($arr) {
                $query->whereIn('Code', $arr);
            });
        }

        if (!empty($attributes['positionCode'])) {
            $arr = explode(',', $attributes['positionCode']);
            $this->model = $this->model->whereHas('positionLevelNow.position', function ($query) use ($arr) {
                $query->whereIn('Code', $arr);
            });
        }

        if ($report) {
            return $this->model;
        }

        if (empty($attributes['limit'])) {
            $users = $this->get();
        } else {
            $users = $this->paginate($attributes['limit']);
        }

        return $users;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $this->creating($attributes);
            $user = User::create($attributes);
            //$this->created($attributes, $user);

            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage,
                'code' => $user->Code
            ];

            $employeeCrm = CrmService::createEmployee($data);

            if (isset($employeeCrm->data->id)) {
                $user->EmployeeIdCrm = $employeeCrm->data->id;
                $user->update();
            }
            $dataAccountant = [
                "application" => 1,
                "businessObjectGroupCode" => "NV",
                "businessObjectRequest" => [
                    "name" => $user->FullName,
                    "branchId" => "00000000-0000-0000-0000-000000000000",
                    "abbreviations" => "",
                    "code" => $user->Code,
                    "email" => $user->Email,
                    "fax" => $user->Fax,
                    "phone" => $user->PhoneNumber,
                    "identityCard" => $user->IdCard,
                    "taxCode" => $user->TaxCode,
                    "address" => $user->Address,
                    "invoiceAddress" => "",
                    "description" => $user->Description,
                    "utilities" => "",
                    "bankAccounts" => "",
                    "rating" => 0,
                    "orderIndex" => 0,
                    "businessObjectType" => "EMPLOYEE",
                    "refId" => $user->Id,
                ]
            ];
            $employeeAccountant = AccountantService::createEmployee($dataAccountant);

            if (!is_null($employeeAccountant)) {
                $user->update(['AccountantId' => $employeeAccountant->id]);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($user);
    }

    public function created($attributes, $model)
    {
        if (!empty($attributes['branchId'])) {
            $model->probationaryContract()->create(['BranchId' => $attributes['branchId']]);

            $model->positionLevel()->create([
                'BranchId' => $attributes['branchId'],
                'StartDate' => now()->format('Y-m-d'),
                'Type' => 'DEFAULT'
            ]);
        }
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $this->updating($attributes);
            $user = User::findOrFail($id);
            $user->update($attributes);
            $this->updated($attributes, $user);

            $dataAccountant = [
                "application" => 1,
                "businessObjectGroupCode" => "NV",
                "id" => $user->AccountantId,
                "businessObjectRequest" => [
                    "name" => $user->FullName,
                    "branchId" => "00000000-0000-0000-0000-000000000000",
                    "abbreviations" => "",
                    "code" => $user->Code,
                    "email" => $user->Email,
                    "fax" => $user->Fax,
                    "phone" => $user->PhoneNumber,
                    "identityCard" => $user->IdCard,
                    "taxCode" => $user->TaxCode,
                    "address" => $user->Address,
                    "invoiceAddress" => "",
                    "description" => $user->Description,
                    "utilities" => "",
                    "bankAccounts" => "",
                    "rating" => 0,
                    "orderIndex" => 0,
                    "businessObjectType" => "EMPLOYEE",
                    "refId" => $user->Id,
                ]
            ];

            if (!is_null($user->AccountantId)) {
                AccountantService::updateEmployee($dataAccountant);
            }

            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage,
                'code' => $user->Code
            ];
            $employeeIdCrm = $user->EmployeeIdCrm;

            if (!is_null($employeeIdCrm)) {
                CrmService::updateEmployee($data, $employeeIdCrm);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($user);
    }

    public function updated($attributes, $model)
    {
        if (!empty($attributes['branchId'])) {
            if ($model->loadCount('positionLevel')->position_level_count < 1) {
                $model->probationaryContract()->create(['BranchId' => $attributes['branchId']]);

                $model->positionLevel()->create([
                    'BranchId' => $attributes['branchId'],
                    'StartDate' => now()->format('Y-m-d'),
                    'Type' => 'DEFAULT'
                ]);
            }
        }
    }

    public function sendEmployeeAccountant()
    {
        \DB::beginTransaction();
        try {
            $users = User::get();
            foreach ($users as $user) {
                $dataAccountant = [
                    "application" => 1,
                    "businessObjectGroupCode" => "NV",
                    "businessObjectRequest" => [
                        "name" => $user->FullName,
                        "branchId" => "00000000-0000-0000-0000-000000000000",
                        "abbreviations" => "",
                        "code" => $user->Code,
                        "email" => $user->Email,
                        "fax" => $user->Fax,
                        "phone" => $user->PhoneNumber,
                        "identityCard" => $user->IdCard,
                        "taxCode" => $user->TaxCode,
                        "address" => $user->Address,
                        "invoiceAddress" => "",
                        "description" => $user->Description,
                        "utilities" => "",
                        "bankAccounts" => "",
                        "rating" => 0,
                        "orderIndex" => 0,
                        "businessObjectType" => "EMPLOYEE",
                        "refId" => $user->Id,
                    ]
                ];
                $employeeAccountant = AccountantService::createEmployee($dataAccountant);

                if (!is_null($employeeAccountant)) {
                    $user->update(['AccountantId' => $employeeAccountant->id]);
                }
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $employeeAccountant;
    }
    public function syncEmployee()
    {
        $employees = User::select('FullName', 'Id', 'FileImage', 'Code')->get();
        $response = CrmService::syncEmployee($employees->toArray());

        foreach ($response->data as $key => $value) {
            $employee = User::where('Id', $value->attributes->employee_id_hrm)->first();
            $employee->EmployeeIdCrm = $value->id;
            $employee->update();
        }

        return $this->parserResult($employees);
    }

    public function updateStatusEmployee(array $attributes, $id)
    {
        $this->model = $this->model->find($id);
        $this->model->update(['status' => User::STATUS[$attributes['status']]]);

        return parent::find($id);
    }

    public function creating(&$attributes)
    {
        $lastName = Str::of($attributes['fullName'])->explode(' ');

        $attributes['LastName'] = $lastName->last();
    }

    public function updating(&$attributes)
    {
        if (!empty($attributes['fullName'])) {
            $lastName = Str::of($attributes['fullName'])->explode(' ');

            $attributes['LastName'] = $lastName->last();
        }
    }

    public function updateLastName()
    {
        $users = $this->model->all();

        $users = $users->each(function ($item) {
            $fullName = Str::of($item->FullName)->explode(' ');
            $this->model()::find($item->Id)->update(['LastName' => $fullName->last()]);
        });
    }

    public function reportEmployeeInfo($attributes)
    {
        $users = $this->getUser($attributes, true);
        $total = $users->get()->count();

        if (empty($attributes['limit'])) {
            $users = $users->get();
        } else {
            $users = $users->paginate($attributes['limit']);
        }

        $results = $users->map(function ($user) use ($attributes) {
            return  [
                'code' => $user->Code,
                'fullName' => $user->FullName,
                'position' => $user->positionLevelNow ? $this->getPosition($user) : '',
                'startDateWorking' => $this->getStartDateWorking($user, $format = 'd/m/Y'),
                'startDateProbationary' => $this->getDateProbationary($user, 'start'),
                'endDateProbationary' => $this->getDateProbationary($user, 'end'),
                'endDateWorking' => $this->getEndDateWorking($user),
                'workingSeniority' => $this->getWorkingSeniority($user, $attributes['date']),
                'gender' => $user->Gender == 'MALE' ? 'Nam' : 'Nữ',
                'dateOfBirth' => Carbon::parse($user->DateOfBirth)->format('d/m/Y'),
                'placeOfBirth' => $user->PlaceOfBirth,
                'idCard' => $user->IdCard,
                'dateOfIssueIdCard' => Carbon::parse($user->DateOfIssueIdCard)->format('d/m/Y'),
                'placeOfIssueIdCard' => $user->PlaceOfIssueIdCard,
                'permanentAddress' => $user->PermanentAddress,
                'address' => $user->Address,
                'phoneNumber' => $user->PhoneNumber,
                'numberDependentPerson' => $this->getNumberDependentPerson($user),
                'taxCode' => $user->TaxCode,
                'numberSocialInsurance' => $this->getSocialInsurance($user),
                'medicalTreatmentPlace' => !is_null($user->healthInsurance) ? $user->healthInsurance->MedicalTreatmentPlace : '',
                'hospitalCode' => !is_null($user->healthInsurance) ? $user->healthInsurance->HospitalCode : '',
                'email' => $user->Email,
                'bankNumberOfAccount' => $user->BankNumberOfAccount,
                'beneficiaryName' => $user->FullName,
                'bankName' => $user->BankName,
                'typeOfContract' => $this->getTypeOfContract($user),
                'startDateContract' => $this->getStartDateContract($user),
                'spouse' => $this->getSpouse($user),
                'children' => $this->getChildren($user),
                'phoneNumberContact' => $user->PhoneNumber
            ];
        })->toArray();
        $meta = [];

        if (isset(request()->limit)) {
            $meta = [
                'pagination' => [
                    'count' => $users->count(),
                    'current_page' => (int) request()->page,
                    'per_page' => (int) request()->limit,
                    'total' => $total,
                    'total_pages' => ceil((int) $total / request()->limit)
                ]
            ];
        }

        $data = [
            'results' => $results,
            'meta' => $meta
        ];
        return $data;
    }

    public function getPosition($user)
    {
        $positionName = '';
        if (!is_null($user->positionLevelNow->position)) {
            $positionName = $user->positionLevelNow->position->Name;
        }

        return $positionName;
    }

    public function getStartDateWorking($user, $format)
    {
        $labourContract = $user->labourContract()->orderBy('ContractFrom', 'asc')->first();
        $probationaryContract = $user->probationaryContract()->orderBy('ContractFrom', 'asc')->first();
        $startDateWorking = '';

        if (!is_null($labourContract) && is_null($probationaryContract)) {
            $startDateWorking = !is_null($labourContract->ContractFrom) ? Carbon::parse($labourContract->ContractFrom)->format($format) : '';
        } elseif (is_null($labourContract) && !is_null($probationaryContract)) {
            $startDateWorking = !is_null($probationaryContract->ContractFrom) ? Carbon::parse($probationaryContract->ContractFrom)->format($format) : '';
        } elseif (!is_null($labourContract) && !is_null($probationaryContract)) {
            if (!is_null($labourContract->ContractFrom) && !is_null($probationaryContract->ContractFrom)) {
                if (Carbon::parse($labourContract->ContractFrom)->format('dmY') < Carbon::parse($probationaryContract->ContractFrom)->format('dmY')) {
                    $startDateWorking = Carbon::parse($labourContract->ContractFrom)->format($format);
                } else {
                    $startDateWorking = Carbon::parse($probationaryContract->ContractFrom)->format($format);
                }
            }
        }

        return $startDateWorking;
    }

    public function getDateProbationary($user, $action)
    {
        $startDateProbationary = '';
        $endDateProbationary = '';

        if ($action == 'start') {
            $probationaryContract = $user->probationaryContract()->orderBy('ContractFrom', 'asc')->first();

            if (!is_null($probationaryContract)) {
                $startDateProbationary = !is_null($probationaryContract->ContractFrom) ? Carbon::parse($probationaryContract->ContractFrom)->format('d/m/Y') : '';
            }

            return $startDateProbationary;
        } elseif ($action == 'end') {
            $probationaryContract = $user->probationaryContract()->orderBy('ContractTo', 'desc')->first();

            if (!is_null($probationaryContract)) {
                $endDateProbationary = !is_null($probationaryContract->ContractFrom) ? Carbon::parse($probationaryContract->ContractTo)->format('d/m/Y') : '';
            }

            return $endDateProbationary;
        }
    }

    public function getEndDateWorking($user)
    {
        $labourContract = $user->labourContract()->orderBy('ContractTo', 'desc')->first();
        $probationaryContract = $user->probationaryContract()->orderBy('ContractTo', 'desc')->first();
        $endDateWorking = '';

        if (!is_null($labourContract) && is_null($probationaryContract)) {
            $endDateWorking = !is_null($labourContract->ContractTo) ? Carbon::parse($labourContract->ContractTo)->format('d/m/Y') : '';
        } elseif (is_null($labourContract) && !is_null($probationaryContract)) {
            $endDateWorking = !is_null($probationaryContract->ContractTo) ? Carbon::parse($probationaryContract->ContractTo)->format('d/m/Y') : '';
        } elseif (!is_null($labourContract) && !is_null($probationaryContract)) {
            if (!is_null($labourContract->ContractTo) && !is_null($probationaryContract->ContractTo)) {
                if (Carbon::parse($labourContract->ContractTo)->format('dmY') < Carbon::parse($probationaryContract->ContractTo)->format('dmY')) {
                    $endDateWorking = Carbon::parse($labourContract->ContractTo)->format('d/m/Y');
                } else {
                    $endDateWorking = Carbon::parse($probationaryContract->ContractTo)->format('d/m/Y');
                }
            }
        }

        return $endDateWorking;
    }

    public function getWorkingSeniority($user, $date)
    {
        $labourContract = $user->labourContract()->orderBy('ContractFrom', 'asc')->first();
        $date = Carbon::parse($date);
        $numberYearWork = 0;
        $numberMonthWork = 0;

        if (!is_null($labourContract)) {
            $quantityWorking = $labourContract->ContractFrom->diff($date);
            $numberMonthWork = $quantityWorking->m;
            $numberYearWork = $quantityWorking->y;
        }

        $result = $numberYearWork . ' năm - ' . $numberMonthWork . ' tháng';

        return $result;
    }

    public function getNumberDependentPerson($user)
    {
        $dependentPersons = $user->children;
        $number = 0;
        foreach ($dependentPersons as $key => $dependentPerson) {
            if ($dependentPerson->IsDependentPerson) {
                $number = ++$key;
            }
        }

        return $number;
    }

    public function getSocialInsurance($user)
    {
        $socialInsurance = $user->insurance()->orderBy('CreationTime', 'desc')->first();

        $numberSocialInsurance = !is_null($socialInsurance) ? $socialInsurance->InsurranceNumber : '';

        return $numberSocialInsurance;
    }

    public function getTypeOfContract($user)
    {
        $dateNow = Carbon::now()->setTimezone('GMT+7')->format('Y-m-d');
        $labourContract = $user->labourContract()->whereDate('ContractFrom', '<=', $dateNow)->whereDate('ContractTo', '>=', $dateNow)->orderBy('ContractTo', 'desc')->first();
        $probationaryContract = $user->probationaryContract()->whereDate('ContractFrom', '<=', $dateNow)->whereDate('ContractTo', '>=', $dateNow)->orderBy('ContractTo', 'desc')->first();
        $typeOfContract = '';
        if (!is_null($labourContract) && is_null($probationaryContract)) {
            $typeOfContract = !is_null($labourContract->typeOfContract) ? $labourContract->typeOfContract->Name : '';
        } elseif (is_null($labourContract) && !is_null($probationaryContract)) {
            $typeOfContract = !is_null($probationaryContract->typeOfContract) ? $probationaryContract->typeOfContract->Name : '';
        } elseif (!is_null($labourContract) && !is_null($probationaryContract)) {
            if (!is_null($labourContract->ContractTo) && !is_null($probationaryContract->ContractTo)) {
                if (Carbon::parse($labourContract->ContractTo)->format('dmY') < Carbon::parse($probationaryContract->ContractTo)->format('dmY')) {
                    $typeOfContract = !is_null($labourContract->typeOfContract) ? $labourContract->typeOfContract->Name : '';
                } else {
                    $typeOfContract = !is_null($probationaryContract->typeOfContract) ? $probationaryContract->typeOfContract->Name : '';
                }
            }
        }

        return $typeOfContract;
    }

    public function getStartDateContract($user)
    {
        $dateNow = Carbon::now()->setTimezone('GMT+7')->format('Y-m-d');
        $labourContract = $user->labourContract()->whereDate('ContractFrom', '<=', $dateNow)->whereDate('ContractTo', '>=', $dateNow)->orderBy('ContractTo', 'desc')->first();
        $probationaryContract = $user->probationaryContract()->whereDate('ContractFrom', '<=', $dateNow)->whereDate('ContractTo', '>=', $dateNow)->orderBy('ContractTo', 'desc')->first();
        $startDateContract = '';
        if (!is_null($labourContract) && is_null($probationaryContract)) {
            $startDateContract = !is_null($labourContract->ContractDate) ? $labourContract->ContractDate->format('d/m/Y') : '';
        } elseif (is_null($labourContract) && !is_null($probationaryContract)) {
            $startDateContract = !is_null($probationaryContract->ContractDate) ? $probationaryContract->ContractDate->format('d/m/Y') : '';
        } elseif (!is_null($labourContract) && !is_null($probationaryContract)) {
            if (!is_null($labourContract->ContractTo) && !is_null($probationaryContract->ContractTo)) {
                if (Carbon::parse($labourContract->ContractTo)->format('dmY') < Carbon::parse($probationaryContract->ContractTo)->format('dmY')) {
                    $startDateContract = !is_null($labourContract->ContractDate) ? $labourContract->ContractDate->format('d/m/Y') : '';
                } else {
                    $startDateContract = !is_null($probationaryContract->ContractDate) ? $probationaryContract->ContractDate->format('d/m/Y') : '';
                }
            }
        }

        return $startDateContract;
    }

    public function getSpouse($user)
    {
        $spouse = $user->children()->where(function ($query) {
            $query->whereLike('Relationship', 'chồng')->orWhereLike('Relationship', 'vợ');
        })->first();

        $nameSpouse = !is_null($spouse) ? $spouse->FullName : '';

        return $nameSpouse;
    }

    public function getChildren($user)
    {
        $children = $user->children()->whereLike('Relationship', 'con')->get();

        $nameChildren = $children->map(function ($item) {
            return $item->FullName;
        })->toArray();
        $nameChildren = !empty($nameChildren) ? implode(', ', $nameChildren) : '';

        return $nameChildren;
    }

    public function exportExcelReportEmployeeInfo($attributes)
    {
        $users = $this->reportEmployeeInfo($attributes);

        $branch = null;
        $division = null;
        $position = null;
        $date = Carbon::parse($attributes['date'])->format('d/m/Y');
        $employee = null;

        if (!empty($attributes['branchId'])) {
            $branch = Branch::find($attributes['branchId']);
        }

        if (!empty($attributes['divisionId'])) {
            $division = Division::find($attributes['divisionId']);
        }

        if (!empty($attributes['positionId'])) {
            $position = Position::find($attributes['positionId']);
        }

        if (!empty($attributes['employeeId'])) {
            $employee = User::find($attributes['employeeId']);
        }

        $params['{branch}'] = !is_null($branch) ? $branch->Name : 'Tất cả cơ sở';
        $params['{division}'] = !is_null($branch) ? $division->Name : 'Tất cả bộ phận';
        $params['{position}'] = !is_null($position) ? $position->Name : 'Tất cả chức vụ';
        $params['{date}'] = $date;
        $params['{employee}'] = !is_null($employee) ? $employee->FullName : 'Tất cả nhân viên';

        foreach ($users['results'] as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[code]'][] = $user['code'];
            $params['[fullName]'][] = $user['fullName'];
            $params['[position]'][] = $user['position'];
            $params['[startDateWorking]'][] = $user['startDateWorking'];
            $params['[startDateProbationary]'][] = $user['startDateProbationary'];
            $params['[endDateProbationary]'][] = $user['endDateProbationary'];
            $params['[endDateWorking]'][] = $user['endDateWorking'];
            $params['[workingSeniority]'][] = $user['workingSeniority'];
            $params['[gender]'][] = $user['gender'];
            $params['[dateOfBirth]'][] = $user['dateOfBirth'];
            $params['[placeOfBirth]'][] = $user['placeOfBirth'];
            $params['[idCard]'][] = $user['idCard'];
            $params['[dateOfIssueIdCard]'][] = $user['dateOfIssueIdCard'];
            $params['[placeOfIssueIdCard]'][] = $user['placeOfIssueIdCard'];
            $params['[permanentAddress]'][] = $user['permanentAddress'];
            $params['[address]'][] = $user['address'];
            $params['[phoneNumber]'][] = $user['phoneNumber'];
            $params['[numberDependentPerson]'][] = $user['numberDependentPerson'];
            $params['[taxCode]'][] = $user['taxCode'];
            $params['[numberSocialInsurance]'][] = $user['numberSocialInsurance'];
            $params['[medicalTreatmentPlace]'][] = $user['medicalTreatmentPlace'];
            $params['[hospitalCode]'][] = $user['hospitalCode'];
            $params['[email]'][] = $user['email'];
            $params['[bankNumberOfAccount]'][] = $user['bankNumberOfAccount'];
            $params['[beneficiaryName]'][] = $user['beneficiaryName'];
            $params['[bankName]'][] = $user['bankName'];
            $params['[typeOfContract]'][] = $user['typeOfContract'];
            $params['[startDateContract]'][] = $user['startDateContract'];
            $params['[spouse]'][] = $user['spouse'];
            $params['[children]'][] = $user['children'];
            $params['[phoneNumberContact]'][] = $user['phoneNumberContact'];
        }

        return $this->excelExporterServices->export('export_excel_employee_info', $params);
    }

    public function reportEmployeeHistory($attributes)
    {
        $users = $this->getUser($attributes, true);
        $users = $users->get();

        $result = [];
        foreach ($users as $key => $user) {
            $positionLevelNow = $user->positionLevelNow;
            $branchName = !is_null($positionLevelNow) ? $positionLevelNow->branch->Name : null;

            if (!is_null($branchName)) {
                if (!array_key_exists($branchName, $result)) {
                    $result[$branchName] = [
                        'branchName' => $branchName,
                        'listEmployee' => [$this->getUserInfo($user)]
                    ];
                } else {
                    $result[$branchName]['listEmployee'][] = $this->getUserInfo($user);
                }
            }
        }

        return $result;
    }

    public function getUserInfo($user)
    {
        $dateNow =  Carbon::now()->format('d/m/Y');
        $data = [
            'id' => $user->Id,
            'fullName' => $user->FullName,
            'dateOfBirth' => Carbon::parse($user->DateOfBirth)->format('d/m/Y'),
            'phoneNumber' => $user->PhoneNumber,
            'address' => $user->Address,
            'numberSocialInsurance' => $this->getSocialInsurance($user),
            'gender' => $user->Gender == 'MALE' ? 'Nam' : 'Nữ',
            'startDateWorking' => $this->getStartDateWorking($user, $format = 'd/m/Y'),
            'dateNow' => $dateNow,
            'numberMonthWorking' => $this->getNumberMonthWorking($user, Carbon::now(), $this->getStartDateWorking($user, $format = 'Y-m-d')),
            'numberAbsent' => '',
            'absent' => '',
            'remainingAbsent' => '',
            'division' => $user->positionLevelNow ? $this->getDivision($user) : '',
            'position' => $user->positionLevelNow ? $this->getPosition($user) : '',
            'numberLabourContract' => $this->getNumberLabourContract($user),
            'contractDate' => $this->getContractDate($user),
            'typeOfContract' => $this->getTypeOfContract($user),
        ];

        return $data;
    }

    public function getNumberMonthWorking($user, $date, $startDateWorking)
    {
        $numberYearWork = 0;
        $numberMonthWork = 0;

        if (!is_null($startDateWorking)) {
            $startDateWorking = Carbon::parse($startDateWorking);
            $quantityWorking = $startDateWorking->diff($date);
            $numberMonthWork = $quantityWorking->m;
            $numberYearWork = $quantityWorking->y;
        }

        $result = $numberYearWork * 12 + $numberMonthWork;

        return $result;
    }

    public function getDivision($user)
    {
        $divisionName = '';
        if (!is_null($user->positionLevelNow->division)) {
            $divisionName = $user->positionLevelNow->division->Name;
        }

        return $divisionName;
    }

    public function getNumberLabourContract($user)
    {
        $labourContract = $user->labourContract()->orderBy('ContractFrom', 'asc')->first();

        $numberLabourContract = '';

        if (!is_null($labourContract)) {
            $ordinalNumber = $labourContract->OrdinalNumber;
            $numberForm = $labourContract->NumberForm;

            $numberLabourContract = $ordinalNumber . '/' . $numberForm;
        }

        return $numberLabourContract;
    }

    public function getContractDate($user)
    {
        $labourContract = $user->labourContract()->orderBy('ContractFrom', 'asc')->first();

        $contractDate = !is_null($labourContract) ? $labourContract->ContractDate->format('d/m/Y') : '';

        return $contractDate;
    }

    public function detailEmployeeHistory($attributes)
    {
        $user = User::find($attributes['employeeId']);
        $positionLevelNow = $user->positionLevelNow;
        $branchName = !is_null($positionLevelNow) ? $positionLevelNow->branch->Name : null;
        $data = $this->getUserInfo($user);
        $data['branch'] = $branchName;
        $appoint = $this->getAppoint($attributes);
        $transfer = $this->getTransfer($attributes);
        $decisionReward = $this->getDecisionReward($attributes);
        $salaryIncrease = $this->getSalaryIncrease($attributes);
        $resignationDecision = $this->getResignationDecision($attributes);
        $data['appoint'] = $appoint;
        $data['transfer'] = $transfer;
        $data['decisionReward'] = $decisionReward;
        $data['salaryIncrease'] = $salaryIncrease;
        $data['resignationDecision'] = $resignationDecision;

        return $data;
    }

    public function getAppoint($attributes)
    {
        $appoints = Appoint::whereHas('appointDetails', function ($query) use ($attributes) {
            $query->where('EmployeeId', $attributes['employeeId']);
        })->get();

        $dataAppoint = [];
        foreach ($appoints as $key => $appoint) {

            $appointDetail = $appoint->appointDetails()->first();
            $position = !is_null($appointDetail->position) ? $appointDetail->position->Name : '';
            $dataAppoint[] = [
                'decisionNumber' => $appoint->DecisionNumber,
                'timeApply' => $appoint->TimeApply->format('d/m/Y'),
                'position' => $position
            ];
        }

        return $dataAppoint;
    }

    public function getTransfer($attributes)
    {
        $transfers = Transfer::whereHas('transferDetails', function ($query) use ($attributes) {
            $query->where('EmployeeId', $attributes['employeeId']);
        })->get();

        $dataTransfer = [];

        foreach ($transfers as $key => $transfer) {
            $dataTransfer[] = [
                'decisionNumber' => $transfer->DecisionNumber,
                'timeApply' => $transfer->TimeApply->format('d/m/Y'),
                'reason' => $transfer->Reason
            ];
        }

        return $dataTransfer;
    }

    public function getDecisionReward($attributes)
    {
        $decisionRewards = DecisionReward::whereHas('decisionRewardDetails', function ($query) use ($attributes) {
            $query->where('EmployeeId', $attributes['employeeId']);
        })->get();

        $dataDecisionReward = [];

        foreach ($decisionRewards as $key => $decisionReward) {
            $decisionRewardDetail = $decisionReward->decisionRewardDetails()->first();
            $dataDecisionReward[] = [
                'decisionNumber' => $decisionReward->DecisionNumber,
                'timeApply' => $decisionRewardDetail->TimeApply->format('d/m/Y'),
                'reason' => $decisionReward->Reason
            ];
        }

        return $dataDecisionReward;
    }

    public function getSalaryIncrease($attributes)
    {
        $salaryIncreases = SalaryIncrease::where('EmployeeId', $attributes['employeeId'])->get();

        $dataSalaryIncrease = [];

        foreach ($salaryIncreases as $key => $salaryIncrease) {
            $dataSalaryIncrease[] = [
                'decisionNumber' => $salaryIncrease->DecisionNumber,
                'timeApply' => $salaryIncrease->TimeApply->format('d/m/Y'),
                'reason' => $salaryIncrease->Reason
            ];
        }

        return $dataSalaryIncrease;
    }

    public function getResignationDecision($attributes)
    {
        $resignationDecisions = ResignationDecision::where('EmployeeId', $attributes['employeeId'])->get();

        $dataResignationDecision = [];

        foreach ($resignationDecisions as $key => $resignationDecision) {
            $dataResignationDecision[] = [
                'decisionNumber' => $resignationDecision->DecisionNumber,
                'timeApply' => $resignationDecision->TimeApply->format('d/m/Y'),
                'reason' => $resignationDecision->Reason
            ];
        }

        return $dataResignationDecision;
    }

    public function getEmployeeBirthday()
    {
        $dateNow = Carbon::now();

        $employeeBirthday =  User::whereMonth('DateOfBirth', $dateNow->format('m'))->whereDay('DateOfBirth', $dateNow->format('d'))->get();

        $dataEmployeeBirthday = $employeeBirthday->map(function ($item) use ($dateNow) {
            return [
                'fileImage' => $item->FileImage,
                'fullName' => $item->FullName,
                'division' => $item->positionLevelNow ? $this->getDivision($item) : '',
                'age' => $item->DateOfBirth->diffInYears($dateNow)
            ];
        })->toArray();

        $configNotification = ConfigNotification::where('Type', ConfigNotification::TYPE['BIRTHDAY'])->first();
        $dateConfigNotification  = Carbon::now()->addDay($configNotification->Date);


        $employeeBirthdayUpcoming = User::whereMonth('DateOfBirth', '>=', $dateNow->format('m'))->whereDay('DateOfBirth', '>', $dateNow->format('d'))
            ->whereMonth('DateOfBirth', '<=', $dateConfigNotification->format('m'))->whereDay('DateOfBirth', '<=', $dateConfigNotification->format('d'))->get();

        $dataEmployeeBirthdayUpcoming = $employeeBirthdayUpcoming->map(function ($item) use ($dateConfigNotification) {
            return [
                'fileImage' => $item->FileImage,
                'fullName' => $item->FullName,
                'division' => $item->positionLevelNow ? $this->getDivision($item) : '',
                'dateOfBirth' => $item->DateOfBirth ? $item->DateOfBirth->format('d/m/Y') : '',
                'age' => $item->DateOfBirth->diffInYears($dateConfigNotification)
            ];
        })->toArray();


        return [
            'dataEmployeeBirthday' => $dataEmployeeBirthday,
            'dataEmployeeBirthdayUpcoming' => $dataEmployeeBirthdayUpcoming
        ];
    }
}
