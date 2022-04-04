<?php

namespace GGPHP\ChildDevelop\Category\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ChildDevelopCategoryCrmServices
{
    public static function createCategorySkill(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills';
        $token = request()->bearerToken();

        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateCategorySkill(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills/' . $id;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->put($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteCategorySkill($paramId, $id)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills/' . $id;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->delete($url, $paramId);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function createCategoryChildIssue(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-child-issues';
        $token = request()->bearerToken();

        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateCategoryChildIssue(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/category-child-issues/' . $id;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->put($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteCategoryChildIssue($id)
    {
        $url = env('CRM_URL') . '/api/v1/category-child-issues/' . $id;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->delete($url);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function createRows($attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-question-parents';
        $token = request()->bearerToken();
        $data = [
            'create_rows' => $attributes
        ];

        $response = Http::withToken($token)->post($url, $data);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateRows($attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-question-parents';
        $token = request()->bearerToken();
        $data = [
            'update_rows' => $attributes
        ];

        $response = Http::withToken($token)->post($url, $data);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteRows($attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-question-parents';
        $token = request()->bearerToken();

        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function UpdateStatusCategorySkill($attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/update-status-category-skills' . '/' . $id;
        $token = request()->bearerToken();

        $response = Http::withToken($token)->put($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function sortCategorySkillCrm($attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-skill-sorts';
        $token = request()->bearerToken();
        $response = Http::withToken($token)->post($url, $attributes);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
