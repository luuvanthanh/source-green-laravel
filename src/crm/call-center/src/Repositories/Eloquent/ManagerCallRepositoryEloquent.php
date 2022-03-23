<?php

namespace GGPHP\Crm\CallCenter\Repositories\Eloquent;

use GGPHP\Crm\CallCenter\Models\ManagerCall;
use GGPHP\Crm\CallCenter\Presenters\ManagerCallPresenter;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ManagerCallRepository;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use Illuminate\Support\Facades\DB;
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
        if (!empty($attributes['fromDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate([
                ['created_at', '<=', $attributes['fromDate']],
                ['created_at', '>=', $attributes['endDate']]
            ])->whereTime([
                ['created_at', '<=', $attributes['fromTime']],
                ['created_at', '>=', $attributes['endTime']]
            ]);
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
            $this->model = $this->model->where('status', ManagerCall::STATUS['CALLED']); //chưa gọicus
        }

        if (!empty($attributes['status_lead_id'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->where(function ($querySub) {
                    $querySub->select('status');
                    $querySub->from('status_lead');
                    $querySub->whereColumn('customer_lead_id', 'manager_calls.customer_lead_id');
                    $querySub->orderBy('created_at', 'desc');
                    $querySub->limit(1);
                }, StatusLead::STATUS_LEAD[$attributes['status_lead_id']]);
            });
        }

        if (!empty($attributes['search'])) {
            $this->model = $this->model->whereHas('customerLead', function ($query) use ($attributes) {
                $query->whereLike('phone', $attributes['search']);
                $query->orWhereLike('full_name', $attributes['search']);
            })->with([
                'customerLead' => function ($query) use ($attributes) {
                    $query->whereLike('phone', $attributes['search']);
                    $query->orWhereLike('full_name', $attributes['search']);
                }
            ]);
        }

        if (!empty($attributes['overtime'])) {
            $this->model = $this->model->where('expected_date', null)->orWhere('status', ManagerCall::STATUS['CALLYET']);
        }

        if (!empty($attributes['call_times'])) {
            $this->model = $this->model->where('call_times', $this->model()::CALLTIME[$attributes['call_times']]);
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

        $data = $this->model->get();

        $callTimes = $data->groupBy('call_times')->map->count()->map(function ($value, $key) {
            return [
                'key' => array_search($key, $this->model()::CALLTIME),
                'value' => $value,
            ];
        })->values()->toArray();

        $total = $data->count();

        $callYet = $data->where('status', ManagerCall::STATUS['CALLYET'])->count(); //chưa gọi

        $called = $data->where('status', ManagerCall::STATUS['CALLED'])->count(); //đã gọi

        $overtime = $data->filter(function ($value, $key) {
            return $value->expected_date == null || $value->status == $this->model()::STATUS['CALLYET'];
        })->count();

        $result = [
            'call_times' => $callTimes,
            'total' => $total,
            'call_yet' => $callYet,
            'called' => $called,
            'overtime' => $overtime
        ];

        return ['data' => $result];
    }

    public function create(array $attributes)
    {
        foreach ($attributes['list_customer_lead'] as $key => $value) {
            $attributes['call_times'] = $this->model()::CALLTIME[$value['call_times']];
            $attributes['customer_lead_id'] = $value['customer_lead_id'];

            $this->model->create($attributes);
        }

        return [];
    }

    public function reportCall(array $attributes)
    {
    }
}
