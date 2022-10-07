<?php

namespace GGPHP\Users\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\AccountantService;
use GGPHP\Core\Services\CrmService;
use GGPHP\Profile\Models\LabourContract;
use GGPHP\Profile\Models\ProbationaryContract;
use GGPHP\Users\Models\User;
use GGPHP\Users\Presenters\UserPresenter;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Support\Str;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class UserRepositoryEloquent extends CoreRepositoryEloquent implements UserRepository
{
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
            $this->created($attributes, $user);

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
                'startDateWorking' => $this->getStartDateWorking($user),
                'startDateProbationary' => $this->getDateProbationary($user, 'start'),
                'endDateProbationary' => $this->getDateProbationary($user, 'end'),
                'endDateWorking' => $this->getEndDateWorking($user),
                'workingSeniority' => $this->getWorkingSeniority($user, $attributes['date']),
                'gender' => $user->Gender,
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

        return $results;
    }

    public function getPosition($user)
    {
        $positionName = '';
        if (!is_null($user->positionLevelNow->position)) {
            $positionName = $user->positionLevelNow->position->Name;
        }

        return $positionName;
    }

    public function getStartDateWorking($user)
    {
        $labourContract = $user->labourContract()->orderBy('ContractFrom', 'asc')->first();
        $probationaryContract = $user->probationaryContract()->orderBy('ContractFrom', 'asc')->first();
        $startDateWorking = '';

        if (!is_null($labourContract) && is_null($probationaryContract)) {
            $startDateWorking = !is_null($labourContract->ContractFrom) ? Carbon::parse($labourContract->ContractFrom)->format('d/m/Y') : '';
        } elseif (is_null($labourContract) && !is_null($probationaryContract)) {
            $startDateWorking = !is_null($probationaryContract->ContractFrom) ? Carbon::parse($probationaryContract->ContractFrom)->format('d/m/Y') : '';
        } elseif (!is_null($labourContract) && !is_null($probationaryContract)) {
            if (!is_null($labourContract->ContractFrom) && !is_null($probationaryContract->ContractFrom)) {
                if (Carbon::parse($labourContract->ContractFrom)->format('dmY') < Carbon::parse($probationaryContract->ContractFrom)->format('dmY')) {
                    $startDateWorking = Carbon::parse($labourContract->ContractFrom)->format('d/m/Y');
                } else {
                    $startDateWorking = Carbon::parse($probationaryContract->ContractFrom)->format('d/m/Y');
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
        $spouse = $user->children()->whereLike('Relationship', 'chồng')->orWhereLike('Relationship', 'vợ')->first();
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
}
