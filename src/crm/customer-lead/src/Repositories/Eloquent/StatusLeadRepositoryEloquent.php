<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Presenters\StatusLeadPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StatusLeadRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StatusLeadRepositoryEloquent extends BaseRepository implements StatusLeadRepository
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
        return StatusLead::class;
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
        return StatusLeadPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['limit'])) {
            $statusLead = $this->paginate($attributes['limit']);
        } else {
            $statusLead = $this->get();
        }

        return $statusLead;
    }
}
