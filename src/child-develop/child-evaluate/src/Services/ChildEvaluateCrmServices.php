<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Services;

use GGPHP\ChildDevelop\Category\Models\CategorySkill;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ChildEvaluateCrmServices
{
    public static function createChildEvaluate(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/child-evaluates';
        $token = request()->bearerToken();

        $data = self::payloadCrm($attributes, $id);

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

    public static function payloadCrm($attributes, $id)
    {
        $categorySkill = CategorySkill::where('Id', $attributes['CategorySkillId'])->first();
        $detail = [];
        if (!empty($attributes['detail'])) {
            foreach ($attributes['detail'] as $value) {
                $detail[] = [
                    'name_criteria' => $value['NameCriteria'],
                    'input_assessment' => $value['InputAssessment'],
                    'periodic_assessment' => $value['PeriodicAssessment'],
                    'use' => $value['Use'],
                    'child_evaluate_detail_clover_id' => $value['Id'],
                    'detail_children' => $value['detailChildren']
                ];
            }
        }

        $data = [
            'category_skill_id' => $categorySkill->CategorySkillCrmId,
            'age' => $attributes['Age'],
            'use' => $attributes['Use'],
            'child_evaluate_clover_id' => $id,
            'detail' => $detail,
        ];

        return $data;
    }

    public static function updateChildEvaluate(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/child-evaluates/' . $id;
        $token = request()->bearerToken();

        $data = self::payloadCrm($attributes, $id);
        $response = Http::withToken($token)->put($url, $data);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function deleteChildEvaluate($id)
    {
        $url = env('CRM_URL') . '/api/v1/child-evaluates/' . $id;
        $token = request()->bearerToken();

        $data = [
            'id' => $id,
        ];

        $response = Http::withToken($token)->delete($url, $data);

        if ($response->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($response->body())->error) && isset(json_decode($response->body())->error->message)) {
                $message = 'CRM: ' . json_decode($response->body())->error->message;
            }
            throw new HttpException(500, $message);
        }

        return json_decode($response->body());
    }

    public static function updateIsUse(array $attributes, $id)
    {
        $url = env('CRM_URL') . '/api/v1/child-evaluate-update-uses/' . $id;
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
}
