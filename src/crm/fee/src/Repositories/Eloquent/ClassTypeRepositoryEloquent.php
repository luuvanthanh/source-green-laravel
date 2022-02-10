<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\ClassType;
use GGPHP\Crm\Fee\Presenters\ClassTypePresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\ClassTypeRepository;
use GGPHP\Crm\Fee\Services\ClassTypeCloverService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ClassTypeRepositoryEloquent extends BaseRepository implements ClassTypeRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ClassType::class;
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
        return ClassTypePresenter::class;
    }

    public function getClassType(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $classType = $this->paginate($attributes['limit']);
        } else {
            $classType = $this->get();
        }

        return $classType;
    }

    public function getClassTypeClover()
    {
        ClassTypeCloverService::result();
    }
}
