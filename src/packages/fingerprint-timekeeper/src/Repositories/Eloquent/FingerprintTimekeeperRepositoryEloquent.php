<?php

namespace GGPHP\FingerprintTimekeeper\Repositories\Eloquent;

use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\FingerprintTimekeeper\Repositories\Contracts\FingerprintTimekeeperRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ImageRepositoryEloquent.
 *
 * @package namespace GGPHP\RolePermission\Repositories\Eloquent;
 */
class FingerprintTimekeeperRepositoryEloquent extends BaseRepository implements FingerprintTimekeeperRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return FingerprintTimekeeper::class;
    }

    public function presenter()
    {
        return \GGPHP\FingerprintTimekeeper\Presenters\FingerprintTimekeeperPresenter::class;
    }

    /*
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
