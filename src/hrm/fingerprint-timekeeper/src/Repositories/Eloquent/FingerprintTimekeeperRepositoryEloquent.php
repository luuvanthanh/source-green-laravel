<?php

namespace GGPHP\FingerprintTimekeeper\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\FingerprintTimekeeper\Repositories\Contracts\FingerprintTimekeeperRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ImageRepositoryEloquent.
 *
 * @package namespace GGPHP\RolePermission\Repositories\Eloquent;
 */
class FingerprintTimekeeperRepositoryEloquent extends CoreRepositoryEloquent implements FingerprintTimekeeperRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

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

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $fingerPrintTimeKeeper = $this->paginate($attributes['limit']);
        } else {
            $fingerPrintTimeKeeper = $this->get();
        }

        return $fingerPrintTimeKeeper;
    }
}
