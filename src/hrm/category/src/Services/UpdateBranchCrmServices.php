<?php

namespace GGPHP\Category\Services;

use Illuminate\Support\Facades\Http;

class UpdateBranchCrmService
{
    public static function updateBranchCrm($token, $data, $id)
    {
        $url = env('CRM_URL') . '/api/v1/branches';

        $payload = [
            'code' => $data->Code,
            'name' => $data->Name,
            'address' => $data->Address,
            'branch_id_hrm' => $data->Id,
            'latitude' => $data->Latitude ? $data->Latitude : null,
            'longitude' => $data->Longitude ? $data->Longitude : null,
        ];
        $result = Http::withToken($token)->put($url . '/' . $id, $payload);

        if ($result->failed()) {
            \Log::info('Có lỗi từ api Branch CRM');
        }
    }
}
