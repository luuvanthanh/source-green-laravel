<?php

namespace GGPHP\Crm\CustomerLead\Repositories\Eloquent;

use GGPHP\Crm\CustomerLead\Models\HistoryCare;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\CustomerLead\Presenters\HistoryCarePresenter;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\HistoryCareRepository;

/**
 * Class EventInfoRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class HistoryCareRepositoryEloquent extends BaseRepository implements HistoryCareRepository
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
        return HistoryCare::class;
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
        return HistoryCarePresenter::class;
    }

    public function getEventInfo(array $attributes)
    {
        if (!empty($attributes['customer_lead_id'])) {
            $this->model = $this->model->where('customer_lead_id', $attributes['customer_lead_id']);
        }

        if (!empty($attributes['limit'])) {
            $eventInfo = $this->paginate($attributes['limit']);
        } else {
            $eventInfo = $this->get();
        }

        return $eventInfo;
    }

    public function createHistoryCare(array $attributes)
    {
        $lastHistoryCare = $this->model->where('customer_lead_id', $attributes['customer_lead_id'])->latest()->first();

        if (is_null($lastHistoryCare)) {
            $attributes['quantity_care'] = 1;
        } else {
            $quantityCare = $lastHistoryCare->quantity_care;
            $attributes['quantity_care'] = $quantityCare + 1;
        }

        $historyCare = $this->model->create($attributes);

        return $this->parserResult($historyCare);
    }
}
