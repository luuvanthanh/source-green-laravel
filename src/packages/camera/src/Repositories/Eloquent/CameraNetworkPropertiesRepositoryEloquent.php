<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use DB;
use GGPHP\Camera\Models\CameraNetworkProperties;
use GGPHP\Camera\Repositories\Contracts\CameraNetworkPropertiesRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CameraNetworkPropertiesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraNetworkPropertiesRepositoryEloquent extends BaseRepository implements CameraNetworkPropertiesRepository
{
    protected $fieldSearchable = [
        'id',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CameraNetworkProperties::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
