<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Events\CallForwardEvent;
use GGPHP\Crm\CallCenter\Events\OutGoingCallEvent;
use GGPHP\Crm\CallCenter\Events\RecevieCallEvent;
use GGPHP\Crm\CallCenter\Events\StatusCallEvent;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CallCenter\Models\Sale;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\Employee\Models\Employee;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Twilio\TwiML\VoiceResponse;

class CallController extends Controller
{
    /**
     * Process a new call
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function newCall(Request $request)
    {
        $create = $this->store($request);

        $response = new VoiceResponse();

        if (is_null($create)) {
            $response->say('Xin vui long goi lai sau, tong dai vien dang ban');
            $response->hangup();

            return $response;
        }

        $callerIdNumber = $request->switchboard ?? config('services.twilio.number');

        $dial = $response->dial('', ['callerId' => $callerIdNumber]);
        $phoneNumberToDial = $request->input('phoneNumber');

        $dial->setRecord(true);
        $dial->setRecordingStatusCallback(env('URL_CRM') . '/api/v1/recording');
        $dial->setRecordingStatusCallbackEvent('in-progress');
        $dial->setRecordingStatusCallbackMethod('POST');

        if (isset($phoneNumberToDial)) {
            $dial->number($phoneNumberToDial, [
                'statusCallback' => env('URL_CRM') . '/api/v1/status',
                'statusCallbackEvent' => 'initiated ringing answered completed busy no-answer canceled in-progress',
                'statusCallbackMethod' => 'POST'
            ]);
        } else {
            $dial->client('support_agent', [
                'statusCallbackEvent' => 'initiated ringing answered completed busy no-answer canceled in-progress',
                'statusCallback' => env('URL_CRM') . '/api/v1/status',
                'statusCallbackMethod' => 'POST'
            ]);
        }

        return $response;
    }

    public function store($request)
    {
        if (!is_null($request->phoneNumber)) {
            $direction = 'Outging';

            $tel = $request->phoneNumber;

            $switchboard = $request->switchboard ?? env('TWILIO_NUMBER');

            $customerLeadId = $request->customer_lead_id;
            $customerLead = !is_null($customerLeadId) ? CustomerLead::find($customerLeadId) : null;

            $employee = Employee::where('employee_id_hrm', $request->employee_id_hrm)->first(); //get id hrm
            $sale_id = $employee->sale->id; //id crm

            broadcast(new OutGoingCallEvent([
                'customer' => $customerLead,
                'sale_id' => $request->sale_id,
                'call_sid' => $request->CallSid,
            ]));
        } else {
            $direction = 'Inbound';
            $switchboard = $request->To;

            $phone = Str::substr($request->From, 4, 9);
            $customerLead = CustomerLead::where('phone', 'like', '%' . $phone)->first();

            if (!is_null($customerLead)) {
                $status = $customerLead->statusLead()->latest('created_at')->first();
                $customerLead->status = is_null($status) ? null : array_search($status->status, StatusLead::STATUS_LEAD);
            }

            $customerLeadId = !is_null($customerLead) ? $customerLead->id : null;
            $tel = is_null($customerLeadId) ? $request->From : $customerLead->phone;

            $sale = Sale::where('status', Sale::STATUS['READY'])->first();

            if (!is_null($sale)) {
                $sale_id = $sale->id;
                $sale->update(['status' => Sale::STATUS['BUSY']]);
                $sale->refresh()->info = $sale->employee;
            } else {
                return null;
            }

            broadcast(new RecevieCallEvent([
                'customer' => $customerLead,
                'sale' => $sale,
                'call_sid' => $request->CallSid,
                'tel' => $tel
            ]));
        }

        $data = [
            'customer_lead_id' => $customerLeadId, //customer_lead_id
            'call_sid' => $request->CallSid,
            'call_status' => $request->CallStatus,
            'direction' => $direction,
            'sale_id' => $sale_id, // id crm
            'phone' => $tel,
            'switchboard' => $switchboard
        ];

        return HistoryCall::create($data);
    }

    public function callFail(Request $request)
    {
        $history = HistoryCall::where('call_sid', $request->CallSid)->first();

        if (!is_null($history)) {
            $history->update([
                'call_status' => $request->CallStatus,
            ]);
        }
    }

    public function status(Request $request)
    {
        $history = HistoryCall::where('call_sid', $request->ParentCallSid)->first();

        if (!is_null($history)) {
            $history->update([
                'call_status' => $request->CallStatus,
            ]);
        }

        broadcast(new StatusCallEvent([
            'call_sid' => $request->ParentCallSid,
            'status' => $request->CallStatus
        ]));
    }

    public function forward(Request $request)
    {
        $sellerForward  = Employee::where('employee_id_hrm', $request->seller_forward_id)->first();
        $sellerForward->sale()->update(['status' => Sale::STATUS['READY']]); //update status sale forward ready

        $sellerReceive = Sale::findOrFail($request->seller_receive);
        $sellerReceive->update(['status' => Sale::STATUS['BUSY']]); //update status sale forwarded busy
        $sellerReceive->refresh()->info = $sellerReceive->employee;

        $call = HistoryCall::where('call_sid', $request->call_sid)
            ->where('sale_id', $sellerForward->sale->id)->first();

        if (!is_null($call)) {
            $call->update(['sale_id' => $request->seller_receive]);
        }

        broadcast(new CallForwardEvent([
            'seller_forward' => $sellerForward,
            'seller_recevice' => $sellerReceive,
            'call' => $call
        ]));
    }

    public function endCall(Request $request)
    {

        \Log::info('end-call', ['data' => $request->all()]);
        // $history = HistoryCall::where('call_sid', $request->CallSid)->first();

        // if (!is_null($history)) {
        //     $history->sale()->update([
        //         'status' => Sale::STATUS['READY'],
        //     ]);
        // }

        // broadcast(new StatusCallEvent([
        //     'call_sid' => $request->ParentCallSid,
        //     'status' => $request->CallStatus
        // ]));
    }

    public function answerCall(Request $request)
    {
        \Log::info('answer-call', ['data' => $request->all()]);
    }

    public function incurredCall(Request $request)
    {
        \Log::info('incurred-call', ['data' => $request->all()]);
    }

    public function headerCMC()
    {
        return   [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Accept-Language' => 'en',
            'Authorization' => 'basic ' . env('KEY_CMC'),
            'Domain' => env('DOMAIN_CMC'),
            'Role' => env('ROLE_USER')
        ];
    }

    public function callOutGoing(Request $request)
    {
        $url = env('URL_CMC') . '/calls';

        $params = [
            'type' => 'external',
            'caller' => '23328',
            'callee' => '0358062034'
        ];

        $data = Http::withHeaders($this->headerCMC())->post($url, $params);

        return $data;
    }

    
}
