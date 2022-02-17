<?php

namespace GGPHP\Crm\Fee\Services;

use GGPHP\Crm\Fee\Models\FeePolicie;
use GGPHP\Crm\Fee\Models\SchoolYear;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FeePolicieCloverService
{
    public static function result()
    {
        $data = self::getFeePolicie();
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

    public static function getFeePolicie()
    {
        $url = self::url() . '/api/v1/fee-policies';

        $params = [
            'feePolicieCrm' => true
        ];

        $data = Http::withToken(self::getToken())->get($url, $params);

        if ($data->failed()) {
            $message = 'Có lỗi từ api Clover';

            if (isset(json_decode($data->body())->error) && isset(json_decode($data->body())->error->message)) {
                $message = 'Clover: ' . json_decode($data->body())->error->message;
            }

            throw new HttpException($data->status(), $data->body());
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
            $check = FeePolicie::where('fee_policie_clover_id', $items['id'])->first();
            $schoolYear = SchoolYear::where('school_year_clover_id', $items['attributes']['schoolYearId'])->first();

            if (is_null($check) && !is_null($schoolYear)) {
                $creates[] = [
                    'id' => Str::uuid(4),
                    'fee_policie_clover_id' => $items['id'],
                    'decision_date' => $items['attributes']['decisionDate'],
                    'decision_number' => $items['attributes']['decisionNumber'],
                    'school_year_id' => $schoolYear->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (!empty($creates)) {
            FeePolicie::insert($creates);
        }

        return $creates;
    }

    public static function updateToClover($data)
    {
        if (!empty($data)) {
            $url = self::url() . '/api/v1/fee-policie-crm';

            $result = Http::withToken(self::getToken())->post($url, $data);

            if ($result->failed()) {
                $message = 'Có lỗi từ api Clover';

                if (isset(json_decode($result->body())->error) && isset(json_decode($result->body())->error->message)) {
                    $message = 'Clover: ' . json_decode($result->body())->error->message;
                }

                throw new HttpException($result->status(), $message);
            }
        }
    }

    public static function created($feePolicie)
    {
        $feePolicie['id'] = $feePolicie['fee_policie_clover_id'];
        
        Http::withToken(self::getToken())->put(self::url() . '/api/v1/fee-policies/' . $feePolicie['id'], $feePolicie);
    }
}
