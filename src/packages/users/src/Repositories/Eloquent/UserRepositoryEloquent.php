<?php

namespace GGPHP\Users\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Users\Models\User;
use GGPHP\Users\Presenters\UserPresenter;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Prettus\Repository\Criteria\RequestCriteria;

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

        $this->model = $this->model->tranferHistory($attributes);

        if (empty($attributes['limit'])) {
            $users = $this->get();
        } else {
            $users = $this->paginate($attributes['limit']);
        }

        return $users;
    }
}
