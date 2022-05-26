<?php

namespace GGPHP\Fee\Services;

use GGPHP\Category\Models\Branch;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class FeePolicieCrmService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/fee-policies';
    }

    public static function create($data, $token)
    {
        $params = [
            'fee_policie_clover_id' => $data->Id,
            'school_year_id' => $data->SchoolYearId,
            'decision_number' => $data->DecisionNumber,
            'decision_date' => $data->DecisionDate,
        ];

        $result = Http::withToken($token)->post(self::url(), $params);

        if ($result->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                $message = 'CRM: ' . json_decode($result->body())->error->message;
            }

            throw new HttpException($result->status(), $message);
        }
    }

    public static function update($data, $id, $token)
    {
        if (!is_null($data->BranchId)) {
            $branch = Branch::find($data->BranchId);

            $branchIdCrm = !is_null($branch) ? $branch->BranchIdCrm : null;
        }

        $params = [
            'school_year_id' => $data->SchoolYearId,
            'decision_number' => $data->DecisionNumber,
            'decision_date' => $data->DecisionDate,
            'branch_id' => $branchIdCrm ?? null
        ];

        $result = Http::withToken($token)->put(self::url() . '/' . $id, $params);

        if ($result->failed()) {
            $message = 'Có lỗi từ api CRM';

            if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                $message = 'CRM: ' . json_decode($result->body())->error->message;
            }

            throw new HttpException($result->status(), $message);
        }
    }
}
