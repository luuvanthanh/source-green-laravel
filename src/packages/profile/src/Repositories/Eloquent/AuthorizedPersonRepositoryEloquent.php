<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Profile\Models\AuthorizedPerson;
use GGPHP\Profile\Presenters\AuthorizedPersonPresenter;
use GGPHP\Profile\Repositories\Contracts\AuthorizedPersonRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AuthorizedPersonRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AuthorizedPersonRepositoryEloquent extends CoreRepositoryEloquent implements AuthorizedPersonRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AuthorizedPerson::class;
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
        return AuthorizedPersonPresenter::class;
    }

    public function getAuthorizedPerson(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereHas('employee', function ($query) use ($employeeId) {
                $query->whereIn('Id', $employeeId);
            });
        }

        if (!empty($attributes['fullName'])) {
            $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['fullName']);
            });
        }

        if (!empty($attributes['dateApply'])) {
            $this->model = $this->model->where('DateApply', '>=', $attributes['dateApply'])->where('DateApply', '<=', $attributes['dateApply']);
        }

        if (!empty($attributes['isEffect'])) {
            $this->model = $this->model->where('IsEffect', $attributes['isEffect']);
        }

        if (!empty($attributes['limit'])) {
            $authorized = $this->paginate($attributes['limit']);
        } else {
            $authorized = $this->get();
        }

        return $authorized;
    }
}
