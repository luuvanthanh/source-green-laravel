<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use DB;
use GGPHP\Camera\Models\CameraGeneralProperties;
use GGPHP\Camera\Repositories\Contracts\CameraGeneralPropertiesRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CameraGeneralPropertiesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraGeneralPropertiesRepositoryEloquent extends BaseRepository implements CameraGeneralPropertiesRepository
{
    protected $fieldSearchable = [
        'id',
        'device_name',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CameraGeneralProperties::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
