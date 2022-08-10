<?php

namespace GGPHP\Category\Services;

use Illuminate\Support\Facades\Http;

class CreateBranchCrmService
{
    public static function createBranchCrm($token, $data)
    {
        $url = env('CRM_URL') . '/api/v1/branches';

        $payload = [
            'code' => $data->Code,
            'name' => $data->Name,
            'address' => $data->Address,
            'branch_id_hrm' => $data->Id,
            'latitude' => $data->Latitude ? $data->Latitude : null,
            'longitude' => $data->Longitude ? $data->Longitude : null,
            'city_id' => $data->CityId
        ];
        $result = Http::withToken($token)->post($url, $payload);

        if ($result->failed()) {
            \Log::info('Có lỗi từ api Branch CRM');
        } else {
            $dataCrm = json_decode($result->body());
            $data->update(['BranchIdCrm' => $dataCrm->data->id]);
        }
    }
}
