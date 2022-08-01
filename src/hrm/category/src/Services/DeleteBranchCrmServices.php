<?php

namespace GGPHP\Category\Services;

use Illuminate\Support\Facades\Http;

class DeleteBranchCrmServices
{
    public static function deleteBranchCrm($token, $id)
    {
        $url = env('CRM_URL') . '/api/v1/branches';
        $result = Http::withToken($token)->delete($url . '/' . $id);

        if ($result->failed()) {
            \Log::info('Có lỗi từ api Branch CRM');
        }
    }
}
