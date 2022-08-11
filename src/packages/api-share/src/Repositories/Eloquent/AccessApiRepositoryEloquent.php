<?php

namespace GGPHP\ApiShare\Repositories\Eloquent;

use GGPHP\ApiShare\Models\AccessApi;
use GGPHP\ApiShare\Presenters\AccessApiPresenter;
use GGPHP\ApiShare\Repositories\Contracts\AccessApiRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AccessApiRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AccessApiRepositoryEloquent extends BaseRepository implements AccessApiRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AccessApi::class;
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
        return AccessApiPresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getAccessApis(array $attributes)
    {
        if (!empty($attributes['api_share_id'])) {
            $this->model = $this->model->where('api_share_id', explode(',', $attributes['api_share_id']));
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
