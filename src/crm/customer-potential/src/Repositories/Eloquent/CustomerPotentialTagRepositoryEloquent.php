<?php

namespace GGPHP\Crm\CustomerPotential\Repositories\Eloquent;

use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;
use GGPHP\Crm\CustomerPotential\Presenters\CustomerPotentialTagPresenter;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialTagRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CustomerPotentialTagRepositoryEloquent extends BaseRepository implements CustomerPotentialTagRepository
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
        return CustomerPotentialTag::class;
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
        return CustomerPotentialTagPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $PotentialStudentInfo = $this->paginate($attributes['limit']);
        } else {
            $PotentialStudentInfo = $this->get();
        }

        return $PotentialStudentInfo;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['customer_tag'])) {
            $customerPotentialTag = CustomerPotentialTag::where('customer_potential_id', $attributes['customer_potential_id'])->delete();
            foreach ($attributes['customer_tag'] as $value) {
                $value['customer_potential_id'] = $attributes['customer_potential_id'];
                $customerPotentialTag = CustomerPotentialTag::create($value);
            }
        }
    
        return parent::parserResult($customerPotentialTag);
    }
}
