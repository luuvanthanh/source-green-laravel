<?php

namespace GGPHP\Crm\Marketing\Imports;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DataMarketingImport implements ToModel, WithValidation, SkipsEmptyRows, WithStartRow, WithMultipleSheets
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $sex = null;
        $birthDate = null;

        if ($row[2] == 'Nam' || $row[2] == 'nam') {
            $sex = DataMarketing::SEX['MALE'];
        } elseif ($row[2] == 'Nữ' || $row[2] == 'nữ') {
            $sex = DataMarketing::SEX['FEMALE'];
        }

        if (!is_null($row[1])) {
            $birthDate = Carbon::parse($row[1])->format('Y-m-d');
        }

        $searchSource = SearchSource::where('type', $row[5])->first();
        $data = [
            'full_name' => $row[0],
            'birth_date' => $birthDate,
            'sex' => $sex,
            'phone' => $row[3],
            'email' => $row[4],
            'search_source_id' => is_null($searchSource) ? null : $searchSource->id,
        ];
        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $data_marketing_code = DataMarketing::max('code');

        if (is_null($data_marketing_code)) {
            $data['code'] = DataMarketing::CODE . $now . '01';
        } else {
            if (substr($data_marketing_code, 2, 8)  != $now) {
                $data['code'] = DataMarketing::CODE . $now . '01';
            } else {
                $stt = substr($data_marketing_code, 2) + 1;
                $data['code'] = DataMarketing::CODE . $stt;
            }
        }
        $data['status'] = DataMarketing::STATUS['NOT_MOVE'];

        DataMarketing::create($data);

        return null;
    }

    public function rules(): array
    {
        return [
            '*.1' => [
                'date_format:d-m-Y'
            ]
        ];
    }

    public function startRow(): int
    {
        return 2;
    }

    public function sheets(): array
    {
        return [
            'template' => new DataMarketingImport()
        ];
    }
}
