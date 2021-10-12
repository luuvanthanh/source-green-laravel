<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use GGPHP\Crm\CustomerPotential\Presenters\CustomerPotentialStatusCarePresenter;
use GGPHP\Crm\CustomerPotential\Presenters\StatusCarePresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialStatusCareRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerPotentialRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CustomerPotentialStatusCareRepositoryEloquent extends BaseRepository implements CustomerPotentialStatusCareRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CustomerPotentialStatusCare::class;
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
        return CustomerPotentialStatusCarePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['customer_potential_id'])) {
            $this->model = $this->model->where('customer_potential_id', $attributes['customer_potential_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerPotentialtatusCare = $this->paginate($attributes['limit']);
        } else {
            $customerPotentialtatusCare = $this->get();
        }

        return $customerPotentialtatusCare;
    }
}
