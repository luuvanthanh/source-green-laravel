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

    public function getUser($attributes)
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
            $this->model = $this->model->whereHas('manualCalculation', function ($q) use ($attributes) {
                $q->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            })->with(['manualCalculation' => function ($query) use ($attributes) {
                $query->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            }]);
        }

        $this->model = $this->model->tranferHistory($attributes);

        if (!empty($attributes['getLimitUser']) && $attributes['getLimitUser'] == 'true') {
            $now = Carbon::now()->format('Y-m-d');

            $this->model = $this->model->whereDoesntHave('labourContract', function ($query) use ($now) {
                $query->where('ContractTo', '<', $now)->where('IsEffect', false);
            })->whereDoesntHave('probationaryContract', function ($query) use ($now) {
                $query->where('ContractTo', '<', $now)->where('IsEffect', false);
            });
        }

        if (!empty('resignationDecision')) {
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
            $user = User::findOrFail($id);
            $user->update($attributes);
            $this->updated($attributes, $user);

            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage,
                'code' => $user->Code
            ];
            $employeeIdCrm = $user->EmployeeIdCrm;
            $employeeCrm = CrmService::updateEmployee($data, $employeeIdCrm);
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
                $employeeAccountant = AccountantService::updateEmployee($dataAccountant);
            }

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
}
