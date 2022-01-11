<?php

namespace GGPHP\Users\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Core\Services\AccountantService;
use GGPHP\Core\Services\CrmService;
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
            if ($attributes['hasClass'] == "true") {
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

        $this->model = $this->model->tranferHistory($attributes);

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
            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage
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
                    "abbreviations" => "string",
                    "code" => $user->Code,
                    "email" => $user->Email,
                    "fax" => $user->Fax,
                    "phone" => $user->PhoneNumber,
                    "identityCard" => "string",
                    "taxCode" => $user->TaxCode,
                    "address" => $user->Address,
                    "invoiceAddress" => "string",
                    "description" => "string",
                    "isActive" => true,
                    "utilities" => "string",
                    "bankAccounts" => "string",
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

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $user = User::findOrFail($id);
            $user->update($attributes);
            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage
            ];
            $employeeIdCrm = $user->EmployeeIdCrm;
            $employeeCrm = CrmService::updateEmployee($data, $employeeIdCrm);
            $dataAccountant = [
                "application" => 1,
                "businessObjectGroupCode" => "NV",
                "businessObjectRequest" => [
                    "name" => $user->FullName,
                    "abbreviations" => "string",
                    "code" => $user->Code,
                    "email" => $user->Email,
                    "fax" => $user->Fax,
                    "phone" => $user->PhoneNumber,
                    "identityCard" => "string",
                    "taxCode" => $user->TaxCode,
                    "address" => $user->Address,
                    "invoiceAddress" => "string",
                    "description" => "string",
                    "isActive" => true,
                    "utilities" => "string",
                    "bankAccounts" => "string",
                    "rating" => 0,
                    "orderIndex" => 0,
                    "businessObjectType" => "EMPLOYEE",
                    "refId" => $user->Id,
                ]
            ];
            $employeeAccountant = AccountantService::updateEmployee($dataAccountant);
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($user);
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
                        "abbreviations" => "string",
                        "code" => $user->Code,
                        "email" => $user->Email,
                        "fax" => $user->Fax,
                        "phone" => $user->PhoneNumber,
                        "identityCard" => "string",
                        "taxCode" => $user->TaxCode,
                        "address" => $user->Address,
                        "invoiceAddress" => "string",
                        "description" => "string",
                        "isActive" => true,
                        "utilities" => "string",
                        "bankAccounts" => "string",
                        "rating" => 0,
                        "orderIndex" => 0,
                        "businessObjectType" => "EMPLOYEE",
                        "refId" => $user->Id,
                    ]
                ];
                $employeeAccountant = AccountantService::createEmployee($dataAccountant);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return $employeeAccountant;
    }
}
