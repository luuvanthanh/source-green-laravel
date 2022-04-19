<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use GGPHP\Camera\Models\CameraService;
use GGPHP\Camera\Presenters\CameraServicePresenter;
use GGPHP\Camera\Repositories\Contracts\CameraServiceRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class CameraServiceRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraServiceRepositoryEloquent extends BaseRepository implements CameraServiceRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CameraService::class;
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
        return CameraServicePresenter::class;
    }
}
