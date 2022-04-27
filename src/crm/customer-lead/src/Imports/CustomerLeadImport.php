<?php

namespace GGPHP\Crm\CustomerLead\Imports;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CustomerLeadImport implements ToModel, WithValidation, SkipsEmptyRows, WithStartRow, WithMultipleSheets
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
            $sex = CustomerLead::SEX['MALE'];
        } elseif ($row[2] == 'Nữ' || $row[2] == 'nữ') {
            $sex = CustomerLead::SEX['FEMALE'];
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
        $data_marketing_code = CustomerLead::max('code');

        if (is_null($data_marketing_code)) {
            $data['code'] = CustomerLead::CODE . $now . '01';
        } else {
            if (substr($data_marketing_code, 2, 8)  != $now) {
                $data['code'] = CustomerLead::CODE . $now . '01';
            } else {
                $stt = substr($data_marketing_code, 2) + 1;
                $data['code'] = CustomerLead::CODE . $stt;
            }
        }

        CustomerLead::create($data);

        return null;
    }

    public function rules(): array
    {
        return [
            '*.4' => [
                'nullable', 'email'
            ],
            '*.0' => [
                'required'
            ],
            '*.3' => [
                'nullable'
            ],
            '*.2' => [
                'required', 'in:nam,nữ,Nam,Nữ'
            ], '*.1' => [
                'nullable', 'date_format:d-m-Y'
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
            'template' => new CustomerLeadImport()
        ];
    }
}
