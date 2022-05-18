<?php

namespace GGPHP\Refund\Repositories\Eloquents;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Refund\Models\ConfigRefund;
use GGPHP\Refund\Presenters\ConfigRefundPresenter;
use GGPHP\Refund\Repositories\Contracts\ConfigRefundRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\Refund\Repositories\Eloquents;
 */
class ConfigRefundRepositoryEloquent extends CoreRepositoryEloquent implements ConfigRefundRepository
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
        return ConfigRefund::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ConfigRefundPresenter::class;
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
