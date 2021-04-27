<?php

namespace GGPHP\Config\Repositories\Eloquent;

use GGPHP\Config\Models\Config;
use GGPHP\Config\Presenters\ConfigPresenter;
use GGPHP\Config\Repositories\Contracts\ConfigRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ConfigRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ConfigRepositoryEloquent extends CoreRepositoryEloquent implements ConfigRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'Name',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Config::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ConfigPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

}
