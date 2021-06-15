<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Presenters\FeePresenter;
use GGPHP\Fee\Repositories\Contracts\FeeRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class FeeRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FeeRepositoryEloquent extends CoreRepositoryEloquent implements FeeRepository
{
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
        return Fee::class;
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
        return FeePresenter::class;
    }

    public function filterFee(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $fee = $this->paginate($attributes['limit']);
        } else {
            $fee = $this->get();
        }

        return $fee;
    }

}
