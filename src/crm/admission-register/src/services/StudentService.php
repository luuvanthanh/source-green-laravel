<?php

namespace GGPHP\Crm\AdmissionRegister\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class StudentService
{
    public static function moveStudentToOfficial(array $attributes)
    {
        $url = env('URL_CLOVER') . '/api/v1/crm/official-students';
        $token = request()->bearerToken();

        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CLOVER';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CLOVER: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException($response->status(), $message);
        }

        return json_decode($response->body());
    }

    public static function createStudent(array $attributes)
    {
        $url = env('SSO_URL') . '/api/students';

        $token = request()->bearerToken();

        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CLOVER';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CLOVER: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException($response->status(), $message);
        }

        return json_decode($response->body());
    }

    public static function deleteStudent(string $id)
    {
        $url = env('SSO_URL') . '/api/students/' . $id;
        $token = request()->bearerToken();

        $getStudent = Http::withToken($token)->get($url);
        $dataStudent = json_decode($getStudent->body());

        if (!empty($dataStudent->student) && !is_null($dataStudent->student->classId)) {
            throw new HttpException($getStudent->status(), 'Học sinh đã được phân bổ không được hủy đăng ký');
        }
        $response = Http::withToken($token)->delete($url);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CLOVER';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CLOVER: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException($response->status(), $message);
        }

        return json_decode($response->body());
    }
}
