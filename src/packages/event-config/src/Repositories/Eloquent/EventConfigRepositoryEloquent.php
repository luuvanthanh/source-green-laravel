<?php

namespace GGPHP\EventConfig\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\EventConfig\Models\EventConfig;
use GGPHP\EventConfig\Presenters\EventConfigPresenter;
use GGPHP\EventConfig\Repositories\Contracts\EventConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class EventConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class EventConfigRepositoryEloquent extends BaseRepository implements EventConfigRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return EventConfig::class;
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
        return EventConfigPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getEventConfigs(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
