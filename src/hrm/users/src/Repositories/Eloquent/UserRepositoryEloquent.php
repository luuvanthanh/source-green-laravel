<?php

namespace GGPHP\Users\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
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

        $this->model = $this->model->tranferHistory($attributes);

        if (!empty($attributes['getLimitUser']) && $attributes['getLimitUser'] == 'true') {
            $now = Carbon::now()->format('Y-m-d');

            $this->model = $this->model->whereDoesntHave('labourContract', function ($query) use ($now) {
                $query->where('ContractTo', '>', $now);
            })->whereDoesntHave('probationaryContract', function ($query) use ($now) {
                $query->where('ContractTo', '>', $now);
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
            
            $data = [
                'full_name' => $user->FullName,
                'employee_id_hrm' => $user->Id,
                'file_image' => $user->FileImage
            ];

            // $employeeCrm = CrmService::createEmployee($data);

            // if (isset($employeeCrm->data->id)) {
            //     $user->EmployeeIdCrm = $employeeCrm->data->id;
            //     $user->update();
            // }
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

            // $data = [
            //     'full_name' => $user->FullName,
            //     'employee_id_hrm' => $user->Id,
            //     'file_image' => $user->FileImage
            // ];
            // $employeeIdCrm = $user->EmployeeIdCrm;

            // if (!is_null($employeeIdCrm)) {
            //     CrmService::updateEmployee($data, $employeeIdCrm);
            // }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($user);
    }
}
