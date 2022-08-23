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
        $attributes = $this->creating($attributes);

        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $key => $value) {
                $lastHistoryCare = $this->model->where('customer_lead_id', $value['customer_lead_id'])->orderBy('quantity_care', 'DESC')->first();

                if (is_null($lastHistoryCare)) {
                    $value['quantity_care'] = 1;
                } else {
                    $quantityCare = $lastHistoryCare->quantity_care;

                    $value['quantity_care'] = $quantityCare + 1;
                }

                $this->model->create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $key => $value) {
                $historyCare = $this->model->findOrFail($value['history_care_id']);
                $historyCare->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            $this->model->whereIn('id', $attributes['delete_rows'])->delete();
        }

        return null;
    }

    public function creating($attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $key => $value) {
                if (!empty($value['status'])) {
                    $attributes['create_rows'][$key]['status'] = HistoryCare::STATUS[$value['status']];
                }

                if (!empty($value['category'])) {
                    $attributes['create_rows'][$key]['category'] = HistoryCare::CATEGORY[$value['category']];
                }
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $key => $value) {
                if (!empty($value['status'])) {
                    $attributes['update_rows'][$key]['status'] = HistoryCare::STATUS[$value['status']];
                }

                if (!empty($value['category'])) {
                    $attributes['update_rows'][$key]['category'] = HistoryCare::CATEGORY[$value['category']];
                }
            }
        }

        return $attributes;
    }
}
