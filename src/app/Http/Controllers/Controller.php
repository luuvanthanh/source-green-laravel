<?php

namespace App\Http\Controllers;

use App\Traits\ResponseTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ResponseTrait;

    public function webhook(Request $request)
    {

        $access_token = "EAAHdA7jSIYIBAPiHLw9D8FMbaFup1eWTzvTj4lZBotnwSklE9pp3uD49VZBzEaDUAuGQWPMHdepZAmfSwWkpM1iA4CNlQwcDLOGqB4SNJkdyvBCKYsUomd7IZCjw7TmZCOKNVB5vy0jTUcYGWZBlsc4YxZAGqjnlGnd0aZBlWjOtaZBP3kIofSoNw";
        $verify_token = "clover";
        $hub_verify_token = null;

        $data = $request->all();

        $id = $data["entry"][0]["messaging"][0]["sender"]["id"];
        $senderMessage = $data["entry"][0]["messaging"][0]['message'];

        if (!empty($senderMessage)) {
            $this->sendTextMessage($id, "Hi buddy");
        }

        // if (isset($request->hub_challenge)) {
        //     $challenge = $request->hub_challenge;
        //     $hub_verify_token = $request->hub_verify_token;
        // }

        // if ($hub_verify_token === $verify_token) {
        //     return $challenge;
        // }

    }

    private function sendTextMessage($recipientId, $messageText)
    {
        $messageData = [
            "recipient" => [
                "id" => $recipientId,
            ],
            "message" => [
                "text" => $messageText,
            ],
        ];
        $ch = curl_init('https://graph.facebook.com/v2.6/me/messages?access_token=' . env("PAGE_ACCESS_TOKEN"));
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($messageData));
        curl_exec($ch);
        curl_close($ch);

    }
}
