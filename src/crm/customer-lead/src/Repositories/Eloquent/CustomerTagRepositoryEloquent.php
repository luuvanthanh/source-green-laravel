<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\CustomerTag;
use GGPHP\Crm\CustomerLead\Presenters\CustomerTagPresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerTagRepository;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class CustomerTagRepositoryEloquent extends BaseRepository implements CustomerTagRepository
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
        return CustomerTag::class;
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
        return CustomerTagPresenter::class;
    }

    public function getCustomerTag(array $attributes)
    {
        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['limit'])) {
            $customerTag = $this->paginate($attributes['limit']);
        } else {
            $customerTag = $this->get();
        }

        return $customerTag;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['customer_tag'])) {
            $customerTag = CustomerTag::where('customer_lead_id', $attributes['customer_lead_id'])->delete();
            foreach ($attributes['customer_tag'] as $value) {
                $value['customer_lead_id'] = $attributes['customer_lead_id'];
                $customerTag = CustomerTag::create($value);
            }
        }

        return parent::parserResult($customerTag);
    }
}
