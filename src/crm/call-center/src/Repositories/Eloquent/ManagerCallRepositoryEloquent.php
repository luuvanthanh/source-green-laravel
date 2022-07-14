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
        if (!empty($attributes['id'])) {
            $ids = explode(',', $attributes['id']);
            $this->model = $this->model->whereIn('id', $ids);
        }

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])
                ->whereDate('created_at', '<=', $attributes['end_date']);
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

        if (!empty($attributes['call_times'])) {

            switch ($attributes['call_times']) {
                case 'OVERTIME':
                    $this->model = $this->model->whereDate('expected_date', '<', now()->toDateString())
                        ->where('status', ManagerCall::STATUS['CALLYET']);
                    break;
                case 'CALL_YET':
                    $this->model = $this->model->where('status', ManagerCall::STATUS['CALLYET']); //chưa gọi
                    break;
                case 'CALLED':
                    $this->model = $this->model->where('status', ManagerCall::STATUS['CALLED']); // đã gọi
                    break;
                default:
                    $this->model = $this->model->where('call_times', ManagerCall::CALLTIME[$attributes['call_times']]);
                    break;
            }
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

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])
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
            return $value->expected_date < now()->toDateString() && $value->status == ManagerCall::STATUS['CALLYET'];
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

    public function statisticCustomerLead(array $attributes)
    {
        $leads  = $this->totalLead($attributes);

        $leadNews = $this->leadNew($attributes);

        $leadPotentials = $this->leadPotential($attributes);

        $leadNotPotentials = $this->leadNotPotential($attributes);

        $firstCall = $this->firstCall($attributes);

        $secondCall = $this->secondCall($attributes);

        $thirdCall = $this->thirdCall($attributes);

        $fourthCall = $this->fourthCall($attributes);

        $fivethCall = $this->fivethCall($attributes);

        $called = $this->called($attributes);

        $callYet = $this->callYet($attributes);

        $overtime = $this->overtime($attributes);

        return [
            'data' => [
                'lead' => $leads,
                'lead_new' => $leadNews,
                'lead_potential' => $leadPotentials,
                'lead_not_potential' => $leadNotPotentials,
                'first' => $firstCall,
                'second' => $secondCall,
                'third' => $thirdCall,
                'fourth' => $fourthCall,
                'fiveth' => $fivethCall,
                'called' => $called,
                'call_yet' => $callYet,
                'out_of_date' => $overtime
            ]
        ];
    }

    public function totalLead($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $leads = $query->selectRaw('count(distinct(customer_lead_id)) as leads')->first()->leads;

        return $leads;
    }

    public function leadNew($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $leadNews = $query->selectRaw('count(distinct(customer_lead_id)) as lead_news')->where('expected_date', null)->whereHas('customerLead.statusLeadLatest', function ($query) {
            $query->where(function ($query) {
                $query->select('status');
                $query->from('status_lead');
                $query->whereColumn('customer_lead_id', 'customer_leads.id');
                $query->latest();
                $query->limit(1);
            }, StatusLead::STATUS_LEAD['LEAD_NEW']);
        })->first()->lead_news;

        return $leadNews;
    }

    public function leadPotential($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $leadPotentials = $query->selectRaw('count(distinct(customer_lead_id)) as lead_potential')->whereHas('customerLead.statusLeadLatest', function ($query) {
            $query->where(function ($query) {
                $query->select('status');
                $query->from('status_lead');
                $query->whereColumn('customer_lead_id', 'customer_leads.id');
                $query->latest();
                $query->limit(1);
            }, StatusLead::STATUS_LEAD['POTENTIAL']);
        })->first()->lead_potential;

        return $leadPotentials;
    }

    public function leadNotPotential($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $leadNotPotentials = $query->selectRaw('count(distinct(customer_lead_id)) as lead_not_potential')->whereHas('customerLead.statusLeadLatest', function ($query) {
            $query->where(function ($query) {
                $query->select('status');
                $query->from('status_lead');
                $query->whereColumn('customer_lead_id', 'customer_leads.id');
                $query->latest();
                $query->limit(1);
            }, StatusLead::STATUS_LEAD['NOT_POTENTIAL']);
        })->first()->lead_not_potential;

        return $leadNotPotentials;
    }

    public function called($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $called = $query->selectRaw('count(*) as called')->where('status', ManagerCall::STATUS['CALLED'])->first()->called;

        return $called;
    }

    public function callYet($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $callYet = $query->selectRaw('count(*) as call_yet')->where('status', ManagerCall::STATUS['CALLYET'])->first()->call_yet;

        return $callYet;
    }

    public function overtime($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);


        $overtime = $query->selectRaw('count(*) as overtime')
            ->whereDate('expected_date', '<', now()->toDateString())
            ->where('status', ManagerCall::STATUS['CALLYET'])->first()->overtime;

        return $overtime;
    }

    public function firstCall($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $firstCall = $query->selectRaw('count(*) as first')->where('call_times', ManagerCall::CALLTIME['FIRST'])->first()->first;

        return $firstCall;
    }

    public function secondCall($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $secondCall = $query->selectRaw('count(*) as second')->where('call_times', ManagerCall::CALLTIME['SECOND'])->first()->second;

        return $secondCall;
    }

    public function thirdCall($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $thirdCall = $query->selectRaw('count(*) as third')->where('call_times', ManagerCall::CALLTIME['THIRD'])->first()->third;

        return $thirdCall;
    }

    public function fourthCall($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $fourthCall = $query->selectRaw('count(*) as fourth')->where('call_times', ManagerCall::CALLTIME['FOURTH'])->first()->fourth;

        return $fourthCall;
    }

    public function fivethCall($attributes)
    {
        $query = $this->model()::query();

        if (!empty($attributes['employee_id'])) {
            $employees = explode(',', $attributes['employee_id']);
            $query = $query->whereIn('employee_id', $employees);
        }

        $query = $query->whereDate('created_at', '>=', $attributes['start_date'])
            ->whereDate('created_at', '<=', $attributes['end_date']);

        $fivethCall = $query->selectRaw('count(*) as fiveth')->where('call_times', ManagerCall::CALLTIME['FIVETH'])->first()->fiveth;

        return $fivethCall;
    }
}
