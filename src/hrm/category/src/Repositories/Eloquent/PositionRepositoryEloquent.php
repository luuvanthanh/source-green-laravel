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
        'CreationTime',
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

    public function getPosition(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $position = $this->paginate($attributes['limit']);
        } else {
            $position = $this->get();
        }

        return $position;
    }
}
