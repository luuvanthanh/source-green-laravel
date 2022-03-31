<?php

namespace GGPHP\Crm\CallCenter\Repositories\Eloquent;

use App\Jobs\UpdateHistoryCallJob;
use GGPHP\Crm\CallCenter\Events\ReceiveCallEvent;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CallCenter\Presenters\HistoryCallPresenter;
use GGPHP\Crm\CallCenter\Repositories\Contracts\HistoryCallRepository;
use GGPHP\Crm\CallCenter\Services\CMCHistoryCallService;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\StatusCareRepository;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use Illuminate\Support\Str;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class HistoryCallRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class HistoryCallRepositoryEloquent extends BaseRepository implements HistoryCallRepository
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
        return HistoryCall::class;
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
        return HistoryCallPresenter::class;
    }

    public function getHistoryCall(array $attributes)
    {
        if (!empty($attributes['from_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->where([
                ['created_at', '>=', $attributes['from_date']],
                ['created_at', '<=', $attributes['end_date']]
            ]);
        }

        if (!empty($attributes['phone'])) {
            $this->model = $this->model->whereLike('phone', $attributes['phone']);
        }

        if (!empty($attributes['switchboard'])) {
            $this->model = $this->model->where('switchboard', $attributes['switchboard']);
        }

        if (!empty($attributes['extension_id'])) {
            $this->model = $this->model->whereHas('employee.extension', function ($query) use ($attributes) {
                $query->where('id', $attributes['extension_id']);
            })->with(['employee.extension' => function ($query) use ($attributes) {
                $query->where('id', $attributes['extension_id']);
            }]);
        }

        if (!empty($attributes['call_status'])) {
            $callStatus = explode(',', $attributes['call_status']);
            $this->model = $this->model->whereIn('call_status', $callStatus);
        }

        if (!empty($attributes['call_type'])) {
            $this->model = $this->model->where('direction', $attributes['call_type']);
        }

        request()->switchboard_number = $this->model()::select('switchboard')->groupBy('switchboard')->get()->map(function ($item) {
            return $item->switchboard;
        });


        if (!empty($attributes['limit'])) {
            $callCenter = $this->paginate($attributes['limit']);
        } else {
            $callCenter = $this->get();
        }

        return $callCenter;
    }

    public function updateEndCall(array $attributes)
    {
        if (!empty($attributes['customer_lead_id']) && !empty($attributes['status_lead'])) {
            $attributes['status'] = StatusLead::STATUS_LEAD[$attributes['status_lead']];
            resolve(StatusLead::class)->create($attributes);
        }

        //Phân loại phụ huynh
        if (!empty($attributes['customer_lead_id']) && !empty($attributes['status_parent_lead_id'])) {
            resolve(StatusCareRepository::class)->create($attributes);
        }

        //Tạo mới ph tiềm năng  vs trạng thái phụ tiềm năng
        if (!empty($attributes['customer_lead_id']) && !empty($attributes['status_parent_potential_id'])) {
            $customerLead = CustomerLead::find($attributes['customer_lead_id']);
            $customerPotential = $customerLead->customerPotential->first();

            $customerLead->customer_lead_id = $customerLead->id;
            $customerLead = $customerLead->toArray();

            unset($customerLead['code']);
            unset($customerLead['id']);
            unset($customerLead['created_at']);
            unset($customerLead['updated_at']);

            if (!$customerLead['flag_move_potential']) {
                $attributes['id'] = $attributes['customer_lead_id'];
                $attributes['statusPotential'] = $attributes['status_parent_potential_id'];

                resolve(CustomerLeadRepository::class)->moveToCustomerPotential($attributes);
            } else {
                $data = [
                    'status_parent_potential_id' => $attributes['status_parent_potential_id'],
                    'customer_potential_id' => $customerPotential->id,
                ];

                CustomerPotentialStatusCare::create($data);
            }
        }

        if ($attributes['call_type'] == 'outbound') {
            $callCenter = $this->model->where('call_id_sub', $attributes['call_id_sub'])->first();
        } else {
            $callCenter = $this->model->findOrFail($attributes['history_call_id']);
        }

        $callCenter->update($attributes);

        return $this->parserResult($callCenter);
    }

    public function callback(array $attributes)
    {
        dispatch(new UpdateHistoryCallJob($attributes));
    }

    public function updateHistoryCall($attributes)
    {
        $call = $this->model()::where('call_id_main', $attributes['data']['uuid'])->first();

        if ($attributes['data']['direction'] == 'inbound' && isset($attributes['data']['hangupCause'])) {
            
            if ($attributes['event'] == 'call-log') {
                $this->callInbound($attributes);
            }
        }

        if ($attributes['data']['direction'] == 'outbound') {
            $this->callOutbound($attributes, $call);
        }
    }

    public function callInbound($attributes)
    {
        $result = CMCHistoryCallService::logCallInbound($attributes['data']['uuid']);

        if (is_null($result)) {
            return null;
        }

        $data = [
            'phone' => $result['phonenumber'],
            'call_id_sub' => $result['callId'],
            'call_id_main' => $result['uuid'],
            'call_id_parent' => $attributes['data']['parrentUuid'],
            'call_status' => Str::upper($result['state']),
            'direction' => Str::upper($result['direction']),
            'switchboard' => $result['pbxNumber'],
            'record_link' => $result['recordUrl'] == '/null' ? null : $result['recordUrl'],
            'hangup_cause' => $result['hangupCause'] ?? null
        ];

        $item = $this->model()::updateOrCreate(['id' => $data['call_id_main']], $data);

        broadcast(new ReceiveCallEvent(['data' => $item]));
    }

    public function callOutbound($attributes, $call)
    {
        $data = [
            'phone' => $attributes['data']['destination'],
            'call_id_sub' => $attributes['data']['callId'],
            'call_id_main' => $attributes['data']['uuid'],
            'call_id_parent' => $attributes['data']['parrentUuid'],
            'call_status' => Str::upper($attributes['data']['state']) ?? null,
            'direction' => Str::upper($attributes['data']['direction']),
            'switchboard' => $attributes['data']['pbxnumber'],
            'record_link' => $attributes['data']['recordUrl'] ?? null,
            'hangup_cause' => $attributes['data']['hangupCause'] ?? null
        ];

        if ($attributes['event'] == 'call-record') {
            unset($data['call_status']);
        }

        $id = !is_null($call) ? $call->id : null;

        $this->model()::updateOrCreate(['id' => $id], $data);
    }
}
