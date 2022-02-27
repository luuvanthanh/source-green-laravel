<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Events\OutGoingCallEvent;
use GGPHP\Crm\CallCenter\Events\RecevieCallEvent;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
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
        $this->store($request);

        $response = new VoiceResponse();
        $callerIdNumber = config('services.twilio.number');

        $dial = $response->dial('', ['callerId' => $callerIdNumber]);
        $phoneNumberToDial = $request->input('phoneNumber');

        $dial->setRecord(true);
        $dial->setRecordingStatusCallback(env('URL_CRM') . '/api/v1/recording');
        $dial->setRecordingStatusCallbackEvent('in-progress');
        $dial->setRecordingStatusCallbackMethod('POST');

        if (isset($phoneNumberToDial)) {
            $dial->number($phoneNumberToDial, [
                'statusCallback' => env('URL_CRM') . '/api/v1/busy',
                'statusCallbackEvent' => 'initiated ringing answered completed busy no-answer canceled in-progress',
                'statusCallbackMethod' => 'POST'
            ]);
        } else {
            $dial->client('support_agent', [
                'statusCallbackEvent' => 'initiated ringing answered completed busy no-answer canceled in-progress',
                'statusCallback' => env('URL_CRM') . '/api/v1/busy',
                'statusCallbackMethod' => 'POST'
            ]);
        }

        return $response;
    }

    public function store($request)
    {
        if (!is_null($request->phoneNumber)) {
            $direction = 'Outging';

            $customerLeadId = $request->customer_lead_id;
            $customerLead = CustomerLead::find($customerLeadId);

            broadcast(new OutGoingCallEvent(['data' => $customerLead]));
        } else {
            $direction = 'Inbound';

            $phone = Str::substr($request->From, 4, 9);
            $customerLead = CustomerLead::where('phone', 'like', '%' . $phone)->first();

            $customerLeadId = !is_null($customerLead) ? $customerLead->id : null;

            broadcast(new RecevieCallEvent(['data' => $customerLead]));
        }

        $data = [
            'customer_lead_id' => $customerLeadId, //customer_lead_id
            'call_sid' => $request->CallSid,
            'call_status' => $request->CallStatus,
            'direction' => $direction
        ];

        HistoryCall::create($data);
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

    public function busy(Request $request)
    {
        $history = HistoryCall::where('call_sid', $request->ParentCallSid)->first();

        if (!is_null($history)) {
            $history->update([
                'call_status' => $request->CallStatus,
            ]);
        }
    }
}
