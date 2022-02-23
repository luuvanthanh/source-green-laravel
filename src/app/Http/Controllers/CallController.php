<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Models\HistoryCall;
use Aws\History;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
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
        $this->store($request);

        $response = new VoiceResponse();
        $callerIdNumber = config('services.twilio.number');

        $dial = $response->dial(null, ['callerId' => $callerIdNumber]);
        $phoneNumberToDial = $request->input('phoneNumber');

        $dial->setRecord(true);
        $dial->setRecordingStatusCallback('https://b8fd-171-225-185-92.ngrok.io/recording');
        $dial->setRecordingStatusCallbackEvent('in-progress');
        $dial->setRecordingStatusCallbackMethod('POST');

        if (isset($phoneNumberToDial)) {
            $dial->number($phoneNumberToDial);
        } else {
            $dial->client('support_agent');
        }

        return $response;
    }

    public function store($request)
    {
        if (!is_null($request->phoneNumber)) {
            $direction = 'Outging';

            $customerLeadId = $request->customer_lead_id;
        } else {
            $direction = 'Inbound';

            $customerLead = CustomerLead::where('phone', 'like', $request->From)->first();
            $customerLeadId = !is_null($customerLead) ? $customerLead->id : null;
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
        $history = HistoryCall::where('call_sid', $request->CallSid)->first();

        if (!is_null($history)) {
            $history->update([
                'call_status' => $request->CallStatus,
            ]);
        }
    }
}
