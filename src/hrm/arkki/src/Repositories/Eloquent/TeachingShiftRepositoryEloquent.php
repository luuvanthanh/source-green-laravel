<?php

namespace GGPHP\Arkki\Repositories\Eloquent;

use GGPHP\Arkki\Models\TeachingShift;
use GGPHP\Arkki\Presenters\TeachingShiftPresenter;
use GGPHP\Arkki\Repositories\Contracts\TeachingShiftRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class StudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TeachingShiftRepositoryEloquent extends CoreRepositoryEloquent implements TeachingShiftRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return TeachingShift::class;
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
        return TeachingShiftPresenter::class;
    }
}
