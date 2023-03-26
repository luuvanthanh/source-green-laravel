<?php

namespace GGPHP\ExpectedTime\Imports;

use Carbon\Carbon;
use GGPHP\EvaluateTeacher\Category\Models\TypeTeacher;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use GGPHP\Users\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use Symfony\Component\HttpKernel\Exception\HttpException;

class TeacherProfileImport implements ToModel, WithValidation, WithStartRow
{
    static $temporary = '';
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $sex = null;
        $birthDate = null;
        $dateOfIssueIdCard = null;
        $typeTeacher = null;

        if ($row[4] == 'Nam' || $row[4] == 'nam') {
            $sex = User::SEX['MALE'];
        } elseif ($row[4] == 'Nữ' || $row[4] == 'nữ') {
            $sex = User::SEX['FEMALE'];
        }

        if (!is_null($row[3])) {
            $date = $date = Carbon::createFromFormat('d/m/Y', $row[3]);
            $birthDate = $date->format('Y-m-d');
        }

        if (!is_null($row[8])) {
            $date = $date = Carbon::createFromFormat('d/m/Y', $row[8]);
            $dateOfIssueIdCard = $date->format('Y-m-d');
        }

        if ($row[10] == 'TEACHER') {
            $typeTeacher = TypeTeacher::where('Name', $row[11])->first();
        }

        $data = [
            'code' => $row[1],
            'fullName' => $row[2],
            'dateOfBirth' => $birthDate,
            'gender' => $sex,
            'category' => User::CATEGORY[$row[10]],
            'status' => User::STATUS['WORKING'],
            'dateOfIssueIdCard' => $dateOfIssueIdCard,
            'phoneNumber' => $row[5] ? $row[5] : null,
            'email' => $row[6] ? $row[6] : null,
            'idCard' => $row[7] ? $row[7] : null,
            'placeOfIssueIdCard' => $row[9] ? $row[9] : null,
        ];
        $user = User::create($data);

        if ($user && $typeTeacher) {
            $user->typeTeacher()->attach($typeTeacher->Id);
        }

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
                'nullable', 'date_format:d/m/Y'
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
                'nullable', 'date_format:d/m/Y'
            ],
            '*.9' => [
                'nullable'
            ],
            '*.10' => [
                'required', 'in:' . $type,
                function ($attribute, $value, $onFailure) {
                    static::$temporary = $value;
                }
            ],
            '*.11' => [
                '',
                function ($attribute, $value, $onFailure) {
                    if (static::$temporary == 'TEACHER' && $value == null) {
                        $onFailure('Trường không được bỏ trống');
                    } elseif (static::$temporary == 'TEACHER' && $value != null) {
                        $typeTeacher = TypeTeacher::where('Name', $value)->first();

                        if (is_null($typeTeacher)) {
                            $onFailure('Trường không hợp lệ');
                        }
                    }
                },
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
        // if (!is_null($data[3])) {
        //     $date = Carbon::createFromFormat('d/m/Y', $data[3]);
        //     $data[3] = $date->format('Y-m-d');
        // }
        return $data;
    }
}
