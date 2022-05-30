<?php

namespace GGPHP\Refund\Repositories\Eloquents;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Refund\Models\RefundDetail;
use GGPHP\Refund\Presenters\RefundDetailPresenter;
use GGPHP\Refund\Repositories\Contracts\RefundDetailRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\Refund\Repositories\Eloquents;
 */
class RefundDetailRepositoryEloquent extends CoreRepositoryEloquent implements RefundDetailRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return RefundDetail::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return RefundDetailPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function index(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }
}
