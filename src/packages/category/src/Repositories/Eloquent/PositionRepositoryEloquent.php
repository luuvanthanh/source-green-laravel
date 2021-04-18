<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Position;
use GGPHP\Category\Presenters\PositionPresenter;
use GGPHP\Category\Repositories\Contracts\PositionRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PositionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PositionRepositoryEloquent extends CoreRepositoryEloquent implements PositionRepository
{
    protected $fieldSearchable = [
        'Id',
        'Name' => 'like',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Position::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return PositionPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        $position = Position::create($attributes);

        return parent::find($position->Id);
    }
}
