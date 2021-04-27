<?php

namespace GGPHP\Clover\Repositories\Eloquent;

use GGPHP\Clover\Models\Parents;
use GGPHP\Clover\Presenters\ParentsPresenter;
use GGPHP\Clover\Repositories\Contracts\ParentRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ParentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ParentRepositoryEloquent extends CoreRepositoryEloquent implements ParentRepository
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
        return Parents::class;
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
        return ParentsPresenter::class;
    }

}
