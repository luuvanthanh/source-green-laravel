<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use GGPHP\Camera\Models\CameraCollection;
use GGPHP\Camera\Repositories\Contracts\CameraCollectionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class CameraCollectionRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraCollectionRepositoryEloquent extends BaseRepository implements CameraCollectionRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CameraCollection::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
