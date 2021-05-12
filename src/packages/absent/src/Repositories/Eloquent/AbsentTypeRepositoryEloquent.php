<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Presenters\AbsentTypePresenter;
use GGPHP\Absent\Repositories\Absent\AbsentTypeRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentTypeRepositoryEloquent extends CoreRepositoryEloquent implements AbsentTypeRepository
{
    protected $fieldSearchable = [
        'Status',
        'Name' => 'like',
        'CreationTime',
        'Id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AbsentType::class;
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
        return AbsentTypePresenter::class;
    }
}
