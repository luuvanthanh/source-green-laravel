<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialEventInfo;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\CustomerPotential\Presenters\CustomerPotentialEventInfoPresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialEventInfoRepository;

/**
 * Class CustomerPotentialEventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class CustomerPotentialEventInfoRepositoryEloquent extends BaseRepository implements CustomerPotentialEventInfoRepository
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
        return CustomerPotentialEventInfo::class;
    }



    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return CustomerPotentialEventInfoPresenter::class;
    }

    public function getCustomerPotentialEventInfo(array $attributes)
    {
        if (!empty($attributes['customer_potential_id'])) {
            $this->model = $this->model->where('customer_potential_id', $attributes['customer_potential_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerPotentialEventInfo = $this->paginate($attributes['limit']);
        } else {
            $customerPotentialEventInfo = $this->get();
        }

        return $customerPotentialEventInfo;
    }
}
