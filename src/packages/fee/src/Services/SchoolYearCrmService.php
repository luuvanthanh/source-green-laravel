<?php

namespace GGPHP\Fee\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SchoolYearCrmService
{
    public static function url()
    {
        return env('CRM_URL') . '/api/v1/school-years';
    }

    public static function create($data, $token)
    {
        $params = [
            'school_year_clover_id' => $data->Id,
            'year_from' => $data->YearFrom,
            'year_to' => $data->YearTo,
            'start_date' => $data->StartDate,
            'end_date' => $data->EndDate,
            'total_month' => $data->TotalMonth,
        ];

        $result = Http::withToken($token)->post(self::url(), $params);

        if ($result->failed()) {
            throw new HttpException($result->status(), $result->body());
        }
    }

    public static function update($data, $id, $token)
    {
        $params = [
            'school_year_clover_id' => $data->Id,
            'year_from' => $data->YearFrom,
            'year_to' => $data->YearTo,
            'start_date' => $data->StartDate,
            'end_date' => $data->EndDate,
            'total_month' => $data->TotalMonth,
        ];

        $result = Http::withToken($token)->put(self::url() . '/' . $id, $params);

        if ($result->failed()) {
            throw new HttpException($result->status(), $result->body());
        }
    }
}
