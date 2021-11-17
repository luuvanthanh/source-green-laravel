<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\EventType;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Category\Presenters\EventTypePresenter;
use GGPHP\Category\Repositories\Contracts\EventTypeRepository;

/**
 * Class EventTypeRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class EventTypeRepositoryEloquent extends BaseRepository implements EventTypeRepository
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
        return EventType::class;
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
        return EventTypePresenter::class;
    }

    public function getEventType(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%')->orWhere('code', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $eventType = $this->paginate($attributes['limit']);
        } else {
            $eventType = $this->get();
        }

        return $eventType;
    }
}
