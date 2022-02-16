<?php

namespace GGPHP\ChildDevelop\TestSemester\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class StudentServices
{
    public static function updateSTudentStatus($status, $id)
    {
        $url = env('NET_URL') . '/api/students/' . $id . '/update-test-status-by-id?Status=' . $status;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->put($url);

        if ($response->failed()) {
            $message = 'Có lỗi từ api student';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'student: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
