<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Division;
use GGPHP\Category\Presenters\DivisionPresenter;
use GGPHP\Category\Repositories\Contracts\DivisionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class DivisionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DivisionRepositoryEloquent extends BaseRepository implements DivisionRepository
{
    protected $fieldSearchable = [
        'id',
        'name' => 'like',
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
