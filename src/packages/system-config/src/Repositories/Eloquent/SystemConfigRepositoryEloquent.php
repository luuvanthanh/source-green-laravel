<?php

namespace GGPHP\SystemConfig\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\SystemConfig\Models\SystemConfig;
use GGPHP\SystemConfig\Presenters\SystemConfigPresenter;
use GGPHP\SystemConfig\Repositories\Contracts\SystemConfigRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SystemConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SystemConfigRepositoryEloquent extends BaseRepository implements SystemConfigRepository
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
        return SystemConfig::class;
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
        return SystemConfigPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getSystemConfigs(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
