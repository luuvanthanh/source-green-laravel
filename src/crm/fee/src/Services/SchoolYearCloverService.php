<?php

namespace GGPHP\Crm\Fee\Services;

use Symfony\Component\HttpKernel\Exception\HttpException;
use GGPHP\Crm\Fee\Models\SchoolYear;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SchoolYearCloverService
{
    public static function result()
    {
        $data = self::getSchoolYear();
        $result = self::processData($data);
        self::updateToClover($result);
    }

    public static function getToken()
    {
        return request()->bearerToken();
    }

    public static function url()
    {
        return env('URL_CLOVER');
    }

    public static function getSchoolYear()
    {
        $url = self::url() . '/api/v1/school-years';

        $params = [
            'schoolYearCrmId' => true
        ];

        $data = Http::withToken(self::getToken())->get($url, $params);

        if ($data->failed()) {
            $message = 'Có lỗi từ api Clover';

            if (isset(json_decode($data->body())->errors) && isset(json_decode($data->body())->errors[0]->detail)) {
                $message = 'Clover: ' . json_decode($data->body())->errors[0]->detail;
            }

            throw new HttpException($data->status(), $message);
        }

        $data = json_decode($data->body(), true);

        return $data;
    }

    public static function processData($data)
    {
        if (empty($data['data'])) {
            return [];
        }

        $data = $data['data'];
        $creates = [];

        foreach ($data as $items) {
            $check = SchoolYear::where('school_year_clover_id', $items['id'])->first();

            if (is_null($check)) {
                $creates[] = [
                    'id' => Str::uuid(4),
                    'school_year_clover_id' => $items['id'],
                    'year_from' => $items['attributes']['yearFrom'],
                    'year_to' => $items['attributes']['yearTo'],
                    'start_date' => $items['attributes']['startDate'],
                    'end_date' => $items['attributes']['endDate'],
                    'total_month' => $items['attributes']['totalMonth'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($creates)) {
            SchoolYear::insert($creates);
        }

        return $creates;
    }

    public static function updateToClover($data)
    {
        if (!empty($data)) {
            $url = self::url() . '/api/v1/school-year-crm';

            $result = Http::withToken(self::getToken())->post($url, $data);

            if ($result->failed()) {
                $message = 'Có lỗi từ api Clover';

                if (isset(json_decode($data->body())->errors) && isset(json_decode($data->body())->errors[0]->detail)) {
                    $message = 'Clover: ' . json_decode($data->body())->errors[0]->detail;
                }

                throw new HttpException($data->status(), $message);
            }
        }
    }
}
