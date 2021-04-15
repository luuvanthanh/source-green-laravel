<?php

namespace GGPHP\Users\Traits;

use GGPHP\Users\Models\User;
use Illuminate\Http\Request;

trait RFIDLogin
{
    /**
     * @param Request $request
     * @return mixed
     */
    public function loginByRFID(Request $request)
    {
        $request->validate([
            'rfid' => 'required|max:15',
            'rfid_patch' => 'required|max:15',
        ]);

        $rfid = $request->input('rfid');
        $rfidPatch = $request->input('rfid_patch');

        try {
            $employee = User::whereHas('magneticCards', function ($query) use ($rfidPatch) {
                $query->where('magnetic_card_patch', '=', $rfidPatch)->where('status', 'ON')->withTrashed();
            })->where('status', '=', User::ON)->firstOrFail();
            foreach ($employee->magneticCards as $value) {
                if ($value->status === 'ON' && \Hash::check($rfid, $value->magnetic_card_token)) {
                    $token = $employee->createToken(['token'])->accessToken;

                    return response()->json([
                        'token_type' => 'Token',
                        'expires_in' => '',
                        'access_token' => $token,
                        'refresh_token' => '',
                        'employee_id' => $employee->id,
                    ]);
                }
            }
            return $this->error('Invalid_credentials', 'The employee credentials were incorrect.', 400);

        } catch (ModelNotFoundException $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->error('Invalid_credentials', 'User does not exist. Please try again', 400);
            }
        }
    }
}
