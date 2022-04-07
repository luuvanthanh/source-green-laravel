<?php

namespace GGPHP\Crm\CallCenter\Repositories\Eloquent;

use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CallCenter\Presenters\ManagerCallPresenter;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ManagerCallRepository;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CallCenterRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ManagerCallRepositoryEloquent extends BaseRepository implements ManagerCallRepository
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
        return ManagerCall::class;
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
        return ManagerCallPresenter::class;
    }

    public function getManagerCall(array $attributes)
    {
        if (!empty($attributes['from_date']) && !empty($attributes['to_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['from_date'])
                ->whereDate('created_at', '<=', $attributes['to_date']);
        }

        if (!empty($attributes['switchboard'])) {
            $this->model = $this->model->where('switchboard', $attributes['key']);
        }

        if (!empty($attributes['extension_id'])) {
            $this->model = $this->model->where('extension_id', $attributes['extension_id']);
        }

        if (!empty($attributes['direction'])) {
            $direction = explode(',', $attributes['direction']);
            $this->model = $this->model->whereIn('direction', $direction);
        }

        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (isset($attributes['call_yet'])) {
            $this->model = $this->model->where('status', ManagerCall::STATUS['CALLYET']); //chưa gọi
        }

        if (isset($attributes['called'])) {
            $this->model = $this->model->where('status', ManagerCall::STATUS['CALLED']); // đã gọi
        }

        if (!empty($attributes['status_lead'])) {
            $this->model = $this->model->whereHas('customerLead.statusLeadLatest', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status');
                    $query->from('status_lead');
                    $query->whereColumn('customer_lead_id', 'manager_calls.customer_lead_id');
                    $query->latest();
                    $query->limit(1);
                }, StatusLead::STATUS_LEAD[$attributes['status_lead']]);
            });
        }

        if (!empty($attributes['status_parent_lead_id'])) {
            $this->model = $this->model->whereHas('customerLead.statusCareLatest', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status_parent_lead_id');
                    $query->from('status_cares');
                    $query->whereColumn('customer_lead_id', 'manager_calls.customer_lead_id');
                    $query->latest();
                    $query->limit(1);
                }, $attributes['status_parent_lead_id']);
            });
        }

        if (!empty($attributes['status_parent_potential_id'])) {
            $this->model = $this->model->whereHas('customerLead.customerPotential.customerPotentialStatusCareLatest', function ($query) use ($attributes) {
                $query->where(function ($query) {
                    $query->select('status_parent_potential_id');
                    $query->from('customer_potential_status_cares');
                    $query->whereColumn('customer_potential_id', 'customer_potentials.id');
                    $query->latest();
                    $query->limit(1);
                }, $attributes['status_parent_potential_id']);
            });
        }

        if (!empty($attributes['search'])) {
            $this->model = $this->model->whereHas('customerLead', function ($query) use ($attributes) {
                $query->where(function ($query) use ($attributes) {
                    $query->orWhereLike('phone', $attributes['search'])->orWhereLike('other_phone', $attributes['search']);
                    $query->orWhereLike('full_name', $attributes['search']);
                });
            })->with([
                'customerLead' => function ($query) use ($attributes) {
                    $query->where(function ($query) use ($attributes) {
                        $query->orWhereLike('phone', $attributes['search'])->orWhereLike('other_phone', $attributes['search']);
                        $query->orWhereLike('full_name', $attributes['search']);
                    });
                }
            ]);
        }

        if (!empty($attributes['overtime'])) {
            $this->model = $this->model->where('expected_date', null)->orWhere('status', ManagerCall::STATUS['CALLYET']);
        }

        if (!empty($attributes['call_times'])) {
            $this->model = $this->model->where('call_times', ManagerCall::CALLTIME[$attributes['call_times']]);
        }

        if (!empty($attributes['limit'])) {
            $managerCalls = $this->paginate($attributes['limit']);
        } else {
            $managerCalls = $this->get();
        }

        return $managerCalls;
    }

    public function countCall(array $attributes)
    {
        if (!empty($attributes['employee_id'])) {
            $this->model = $this->model->where('employee_id', $attributes['employee_id']);
        }

        if (!empty($attributes['from_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['from_date'])
                ->whereDate('created_at', '<=', $attributes['end_date']);
        }

        $data = $this->model->get();

        $firstCall = $data->where('call_times', $this->model()::CALLTIME['FIRST'])->count();

        $secondCall = $data->where('call_times', $this->model()::CALLTIME['SECOND'])->count();

        $thirdCall = $data->where('call_times', $this->model()::CALLTIME['THIRD'])->count();

        $fourthCall = $data->where('call_times', $this->model()::CALLTIME['FOURTH'])->count();

        $fivethCall = $data->where('call_times', $this->model()::CALLTIME['FIVETH'])->count();

        $notScheduledYet = $data->where('call_times', $this->model()::CALLTIME['YET_CREATE'])->count();

        $total = $data->count();

        $callYet = $data->where('status', ManagerCall::STATUS['CALLYET'])->count(); //chưa gọi

        $called = $data->where('status', ManagerCall::STATUS['CALLED'])->count(); //đã gọi

        $overtime = $data->filter(function ($value) {
            return $value->expected_date == null || $value->status == $this->model()::STATUS['CALLYET'];
        })->count();


        $result = [
            'total' => $total,
            'first' => $firstCall,
            'second' => $secondCall,
            'third' => $thirdCall,
            'fourth' => $fourthCall,
            'fiveth' => $fivethCall,
            'call_yet' => $callYet,
            'called' => $called,
            'overtime' => $overtime,
            'yet_create' => $notScheduledYet
        ];

        return ['data' => $result];
    }

    public function create(array $attributes)
    {
        foreach ($attributes['list_customer_lead'] as $key => $value) {
            //Xóa record nếu trùng id phlead, khác employee và lần gọi bằng null
            $this->model->where([
                ['customer_lead_id', $value['customer_lead_id']],
                ['employee_id', '!=', $attributes['employee_id']],
            ])->where('call_times', null)->delete();

            if ($attributes['call_times'] == 'FIRST') {
                $this->model->where([
                    ['customer_lead_id', $value['customer_lead_id']],
                    ['employee_id', $attributes['employee_id']],
                ])->where('call_times', null)->update(['call_times' => $this->model()::CALLTIME['FIRST']]);
            } else {
                $attributes['call_times'] = $this->model()::CALLTIME[$attributes['call_times']];
                $attributes['customer_lead_id'] = $value['customer_lead_id'];

                $this->model->create($attributes);
            }
        }

        return [];
    }
}
