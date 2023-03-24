<?php

namespace GGPHP\ExpectedTime\Imports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Validator;

use Symfony\Component\HttpKernel\Exception\HttpException;

class TeacherProfileImport implements ToModel, WithValidation, WithStartRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // dd($row);
        // $sex = null;
        // $birthDate = null;

        // if ($row[2] == 'Nam' || $row[2] == 'nam') {
        //     $sex = DataMarketing::SEX['MALE'];
        // } elseif ($row[2] == 'Nữ' || $row[2] == 'nữ') {
        //     $sex = DataMarketing::SEX['FEMALE'];
        // }

        // if (!is_null($row[1])) {
        //     $birthDate = Carbon::parse($row[1])->format('Y-m-d');
        // }
        // $searchSource = SearchSource::where('type', $row[6])->first();
        // $data = [
        //     'full_name' => $row[0],
        //     'birth_date' => $birthDate,
        //     'sex' => $sex,
        //     'phone' => $row[3],
        //     'email' => $row[4],
        //     'facebook' => $row[5],
        //     'note' => $row[7],
        //     'search_source_id' => is_null($searchSource) ? null : $searchSource->id,
        // ];
        // $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        // $data_marketing_code = DataMarketing::max('code');

        // if (is_null($data_marketing_code)) {
        //     $data['code'] = DataMarketing::CODE . $now . '01';
        // } else {
        //     if (substr($data_marketing_code, 2, 8)  != $now) {
        //         $data['code'] = DataMarketing::CODE . $now . '01';
        //     } else {
        //         $stt = substr($data_marketing_code, 2) + 1;
        //         $data['code'] = DataMarketing::CODE . $stt;
        //     }
        // }
        // $data['status'] = DataMarketing::STATUS['NOT_MOVE'];

        // DataMarketing::create($data);

        return null;
    }

    public function rules(): array
    {
        $type = implode(',', array_keys(User::CATEGORY));

        return [
            '*.1' => [
                'required', 'unique:Employees,Code'
            ],
            '*.2' => [
                'required', 'string'
            ],
            '*.3' => [
                'nullable','date_format:d/m/Y',
            ],
            '*.4' => [
                'required', 'in:nam,nữ,Nam,Nữ'
            ],
            '*.5' => [
                'nullable'
            ],
            '*.6' => [
                'nullable', 'email'
            ],
            '*.7' => [
                'nullable'
            ],
            '*.8' => [
                'nullable'
            ],
            '*.9' => [
                'nullable'
            ],
            '*.10' => [
                'required', 'in:' . $type,
            ]
        ];
    }

    public function startRow(): int
    {
        return 5;
    }

    /**
     * Tweak the data slightly before sending it to the validator
     * @param $data
     * @param $index
     * @return mixed
     */
    public function prepareForValidation($data, $index)
    {  
        return $data;
    }
}
