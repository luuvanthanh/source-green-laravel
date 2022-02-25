<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Exception;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use Illuminate\Http\Request;
use Twilio\Exceptions\RestException;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\SyncGrant;
use Twilio\Rest\Client;

class VoiceController extends Controller
{
    public function __construct()
    {
        // Twilio credentials
        $this->account_sid = env('TWILIO_ACCOUNT_SID');
        $this->auth_token = env('AUTH_TOKEN');
        //the twilio number you purchased
        $this->from = env('TWILIO_NUMBER');

        // Initialize the Programmable Voice API
        $this->client = new Client($this->account_sid, $this->auth_token);
    }

    /**
     * Making an outgoing call
     */
    public function initiateCall(Request $request)
    {
        // Validate form input
        $this->validate($request, [
            'phone_number' => 'required|string',
        ]);

        try {
            //Lookup phone number to make sure it is valid before initiating call
            $phone_number = $this->client->lookups->v1->phoneNumbers($request->phone_number)->fetch();

            // If phone number is valid and exists
            if ($phone_number) {
                // Initiate call and record call
                $call = $this->client->account->calls->create(
                    $request->phone_number, // Destination phone number
                    $this->from, // Valid Twilio phone number
                    array(
                        "record" => True,
                        "url" => "http://demo.twilio.com/docs/voice.xml"
                    )
                );

                if ($call) {
                    echo 'Call initiated successfully';
                } else {
                    echo 'Call failed!';
                }
            }
        } catch (Exception $e) {
            echo 'Error: ' . $e->getMessage();
        } catch (RestException $rest) {
            echo 'Error: ' . $rest->getMessage();
        }
    }

    public function generateToken(Request $request)
    {
        $identity = $request->query('username');

        throw_if(
            !$identity,
            new Exception('Please Provide a Username query string')
        );

        // Create a grant identifying the Sync service instance for this app
        $syncGrant = new SyncGrant();

        $syncGrant->setServiceSid(config('services.twilio.serviceSid'));

        /**
         * Create an access token which we will sign and return to the client,
         * containing the grant we just created and specifying his identity.
         */
        $token = new AccessToken(
            config('services.twilio.accountSid'),
            config('services.twilio.apiKey'),
            config('services.twilio.apiSecret')
        );

        $token->addGrant($syncGrant);

        $token->setIdentity($identity);

        return response(['identity' => $identity, 'token' => $token->toJWT()]);
    }

    public function recording(Request $request)
    {
        $history = HistoryCall::where('call_sid', $request->CallSid)->first();

        if (!is_null($history)) {
            $history->update([
                'record_link' => $request->RecordingUrl
            ]);
        }
    }
}
