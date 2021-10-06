<?php

namespace GGPHP\Clover\Repositories\Eloquent;

use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Presenters\ClassesPresenter;
use GGPHP\Clover\Repositories\Contracts\ParentRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ClassRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ClassRepositoryEloquent extends CoreRepositoryEloquent implements ParentRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'FullName' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Classes::class;
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
        return ClassesPresenter::class;
    }
}
