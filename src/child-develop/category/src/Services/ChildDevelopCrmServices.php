<?php

namespace GGPHP\ChildDevelop\Category\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ChildDevelopCrmServices
{
    public static function createCategorySkill(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills';

        $response = Http::post($url, $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";
            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateCategorySkill(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills/' . $id;

        $response = Http::put($url, $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteCategorySkill($paramId, $id)
    {
        $url = env('CRM_URL') . '/api/v1/category-skills/' . $id;

        $response = Http::delete($url, $paramId);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function createCategoryChildIssue(array $attributes)
    {
        $url = env('CRM_URL') . '/api/v1/category-child-issues';

        $response = Http::post($url, $attributes);

        if ($response->failed()) {
            $message = "Có lỗi từ api CRM";

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = "CRM: " . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }
}
