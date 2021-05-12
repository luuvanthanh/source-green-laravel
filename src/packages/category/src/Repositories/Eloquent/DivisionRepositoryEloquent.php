<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Division;
use GGPHP\Category\Presenters\DivisionPresenter;
use GGPHP\Category\Repositories\Contracts\DivisionRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DivisionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DivisionRepositoryEloquent extends CoreRepositoryEloquent implements DivisionRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Division::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DivisionPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
