<?php

namespace GGPHP\ApiShare\Repositories\Eloquent;

use GGPHP\Camera\Models\Camera;
use GGPHP\ApiShare\Models\ApiShare;
use GGPHP\ApiShare\Presenters\ApiSharePresenter;
use GGPHP\ApiShare\Repositories\Contracts\ApiShareRepository;
use Illuminate\Support\Facades\Http;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ApiShareRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ApiShareRepositoryEloquent extends BaseRepository implements ApiShareRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ApiShare::class;
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
        return ApiSharePresenter::class;
    }

    /**
     * Get video walls
     *
     * @param array $attributes
     */
    public function getApiShares(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
