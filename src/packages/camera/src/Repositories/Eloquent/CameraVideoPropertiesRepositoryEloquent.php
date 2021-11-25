<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use DB;
use GGPHP\Camera\Models\CameraVideoProperties;
use GGPHP\Camera\Repositories\Contracts\CameraVideoPropertiesRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CameraVideoPropertiesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraVideoPropertiesRepositoryEloquent extends BaseRepository implements CameraVideoPropertiesRepository
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
        return CameraVideoProperties::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
