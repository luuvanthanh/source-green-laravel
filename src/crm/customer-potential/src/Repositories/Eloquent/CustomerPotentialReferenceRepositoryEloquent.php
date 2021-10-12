<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialReference;
use GGPHP\Crm\CustomerPotential\Presenters\CustomerPotentialReferencePresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialReferenceRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerPotentialEventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class CustomerPotentialReferenceRepositoryEloquent extends BaseRepository implements CustomerPotentialReferenceRepository
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
        return CustomerPotentialReference::class;
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
        return CustomerPotentialReferencePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['customer_potential_id'])) {
            $this->model = $this->model->where('customer_potential_id', $attributes['customer_potential_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerPotentialReference = $this->paginate($attributes['limit']);
        } else {
            $customerPotentialReference = $this->get();
        }

        return $customerPotentialReference;
    }

    public function create(array $attributes)
    {
        $customerPotentialReferenceId = CustomerPotentialReference::where('customer_potential_id', $attributes['customer_potential_id'])->first();

        \DB::beginTransaction();
        try {

            if (is_null($customerPotentialReferenceId)) {

                CustomerPotentialReference::create($attributes);
            }

            if (!is_null($customerPotentialReferenceId)) {
                $customerPotentialReferenceId->update($attributes);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }
}
