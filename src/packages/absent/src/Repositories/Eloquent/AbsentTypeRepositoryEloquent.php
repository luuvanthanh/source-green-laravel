<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Presenters\AbsentTypePresenter;
use GGPHP\Absent\Repositories\Absent\AbsentTypeRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentTypeRepositoryEloquent extends BaseRepository implements AbsentTypeRepository
{
    protected $fieldSearchable = [
        'status',
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
