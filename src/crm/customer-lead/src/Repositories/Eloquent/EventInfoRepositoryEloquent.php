<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\EventInfo;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\CustomerLead\Presenters\EventInfoPresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\EventInfoRepository;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class EventInfoRepositoryEloquent extends BaseRepository implements EventInfoRepository
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
        return EventInfo::class;
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
        return EventInfoPresenter::class;
    }

    public function getEventInfo(array $attributes)
    {

        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where('date', '>=', $attributes['start_date'])->where('date', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $eventInfo = $this->paginate($attributes['limit']);
        } else {
            $eventInfo = $this->get();
        }

        return $eventInfo;
    }
}
