<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\ObjectType;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\ObjectTypePresenter;
use GGPHP\Category\Repositories\Contracts\ObjectTypeRepository;

/**
 * Class ObjectTypeRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class ObjectTypeRepositoryEloquent extends BaseRepository implements ObjectTypeRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ObjectType::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return ObjectTypePresenter::class;
    }

    public function getObjectType(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $language = $this->paginate($attributes['limit']);
        } else {
            $language = $this->get();
        }

        return $language;
    }
}
