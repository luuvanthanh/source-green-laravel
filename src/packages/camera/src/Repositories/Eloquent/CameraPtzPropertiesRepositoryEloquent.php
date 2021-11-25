<?php

namespace GGPHP\Camera\Repositories\Eloquent;

use DB;
use GGPHP\Camera\Models\CameraPtzProperties;
use GGPHP\Camera\Repositories\Contracts\CameraPtzPropertiesRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CameraPtzPropertiesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CameraPtzPropertiesRepositoryEloquent extends BaseRepository implements CameraPtzPropertiesRepository
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
        return CameraPtzProperties::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
