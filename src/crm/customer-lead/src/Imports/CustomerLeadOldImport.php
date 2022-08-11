<?php

namespace GGPHP\Crm\CustomerLead\Imports;

use Carbon\Carbon;
use GGPHP\Crm\Category\Models\Branch;
use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use GGPHP\Crm\CustomerLead\Repositories\Eloquent\CustomerLeadRepositoryEloquent;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Province\Models\City;
use GGPHP\Crm\Province\Models\District;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CustomerLeadOldImport implements ToCollection, WithValidation, SkipsEmptyRows, WithStartRow, WithMultipleSheets
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $this->storeCustomerLead($row);
        }

        return null;
    }

    public function rules(): array
    {
        return [
            '*.2' => [
                'nullable', 'date_format:d-m-Y'
            ],
            '*.3' => [
                'nullable', 'in:nam,nữ,Nam,Nữ'
            ],
            '*.4' => [
                'nullable', 'email'
            ],
            '*.12' => [
                'nullable', 'date_format:d-m-Y'
            ],
            '*.13' => [
                'nullable', 'in:nam,nữ,Nam,Nữ'
            ],
            '*.14' => [
                'nullable', 'date_format:d-m-Y'
            ],
            '*.15' => [
                'nullable', 'in:Lead mới,Tiềm năng,Không tiềm năng'
            ],
        ];
    }

    public function startRow(): int
    {
        return 2;
    }

    public function sheets(): array
    {
        return [
            'template' => new CustomerLeadOldImport()
        ];
    }

    public function storeCustomerLead($row)
    {
        $customerLead = [];
        $sexCustomer = null;
        $birthDateCustomer = null;
        $searchSource = null;
        $district = null;
        $city = null;
        $branch = null;
        $adviseDate = null;
        $employee  = null;

        if (!is_null($row[3])) {
            if ($row[3] == 'Nam' || $row[3] == 'nam') {
                $sexCustomer = CustomerLead::SEX['MALE'];
            } elseif ($row[3] == 'Nữ' || $row[3] == 'nữ') {
                $sexCustomer = CustomerLead::SEX['FEMALE'];
            }
        }

        if (!is_null($row[0])) {
            $employee = Employee::whereLike('full_name', $row[0])->first();
        }

        if (!is_null($row[2])) {
            $birthDateCustomer = Carbon::parse($row[2])->format('Y-m-d');
        }

        if (!is_null($row[7])) {
            $district = District::whereLike('name', $row[7])->first();
        }

        if (!is_null($district)) {
            $city = City::where('id', $district->city_id)->first();
        }

        if (!is_null($row[8])) {
            $searchSource = SearchSource::where('type', $row[8])->first();
        }

        if (!is_null($row[10])) {
            $branch = Branch::whereLike('name', $row[10])->first();
        }

        if (!is_null($row[14])) {
            $adviseDate = Carbon::parse($row[14])->format('Y-m-d');
        }

        $dataCustomerLead = [
            'employee_id' => is_null($employee) ? null : $employee->id,
            'full_name' => $row[1],
            'birth_date' => $birthDateCustomer,
            'sex' => $sexCustomer,
            'email' => $row[4],
            'phone' => $row[5],
            'address' => $row[6],
            'district_id' => is_null($district) ? null : $district->id,
            'city_id' => is_null($city) ? null : $city->id,
            'search_source_id' => is_null($searchSource) ? null : $searchSource->id,
            'facebook' => $row[9],
            'branch_id' => is_null($branch) ? null : $branch->id,
            'advise_date' => $adviseDate,
            'note' => $row[16],
            'concerns' => $row[17],
            'data_excel' => true,
        ];

        $now = Carbon::now()->setTimezone('GMT+7')->format('Ymd');
        $customerLeadCode = CustomerLead::max('code');

        if (is_null($customerLeadCode)) {
            $dataCustomerLead['code'] = CustomerLead::CODE . $now . '01';
        } else {
            if (substr($customerLeadCode, 2, 8)  != $now) {
                $dataCustomerLead['code'] = CustomerLead::CODE . $now . '01';
            } else {
                $stt = substr($customerLeadCode, 2) + 1;
                $dataCustomerLead['code'] = CustomerLead::CODE . $stt;
            }
        }

        if (!is_null($dataCustomerLead['full_name'])) {
            $customerLead = CustomerLead::create($dataCustomerLead);
        }
        $this->storeStatusLead($customerLead, $row);
        $this->storeStudent($customerLead, $row);
        return null;
    }

    public function storeStatusLead($customerLead, $row)
    {
        if (!empty($customerLead)) {
            $statusLead = StatusLead::STATUS_LEAD['LEAD_NEW'];

            if (!is_null($row[17])) {
                if ($row[15] == 'Lead mới') {
                    $statusLead = StatusLead::STATUS_LEAD['LEAD_NEW'];
                } elseif ($row[15] == 'Tiềm năng') {
                    $statusLead = StatusLead::STATUS_LEAD['POTENTIAL'];
                    $this->moveToCustomerPotential($customerLead);
                } elseif ($row[15] == 'Không tiềm năng') {
                    $statusLead = StatusLead::STATUS_LEAD['NOT_POTENTIAL'];
                }

                $dataStatusLead = [
                    'customer_lead_id' => $customerLead->id,
                    'status' => $statusLead
                ];

                StatusLead::create($dataStatusLead);
            }
        }

        return null;
    }

    public function storeStudent($customerLead, $row)
    {
        if (!is_null($row[11])) {

            if (!empty($customerLead)) {
                $customerLeadId = $customerLead->id;
            } else {
                $customerLead = CustomerLead::where('data_excel', true)->orderBy('created_at', 'DESC')->orderBy('full_name', 'DESC')->first();
                $customerLeadId = $customerLead->id;
            }

            $birthDateStudent = null;
            $sexStudent = null;

            if (!is_null($row[12])) {
                $birthDateStudent = Carbon::parse($row[12])->format('Y-m-d');
            }

            if (!is_null($row[3])) {
                if ($row[13] == 'Nam' || $row[13] == 'nam') {
                    $sexStudent = CustomerLead::SEX['MALE'];
                } elseif ($row[13] == 'Nữ' || $row[13] == 'nữ') {
                    $sexStudent = CustomerLead::SEX['FEMALE'];
                }
            }

            $dataStudent = [
                'full_name' => $row[11],
                'birth_date' => $birthDateStudent,
                'sex' => $sexStudent,
                'customer_lead_id' => $customerLeadId
            ];

            StudentInfo::create($dataStudent);
        }


        return null;
    }

    public function moveToCustomerPotential($customerLead)
    {
        $data = [
            'code' => $customerLead->code,
            'employee_id' => $customerLead->employee_id,
            'full_name' => $customerLead->full_name,
            'birth_date' => $customerLead->birth_date,
            'sex' =>  $customerLead->sex,
            'email' => $customerLead->email,
            'phone' => $customerLead->phone,
            'address' => $customerLead->address,
            'district_id' =>  $customerLead->district_id,
            'city_id' => $customerLead->city_id,
            'search_source_id' => $customerLead->search_source_id,
            'facebook' => $customerLead->facebook,
            'customer_lead_id' => $customerLead->id,
        ];

        $customerPotential = CustomerPotential::create($data);
        $customerLead->update(['flag_move_potential' => true]);

        return null;
    }

    /**
     * Tweak the data slightly before sending it to the validator
     * @param $data
     * @param $index
     * @return mixed
     */
    public function prepareForValidation($data, $index)
    {
        if (is_numeric($data[2])) {
            $data[2] = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($data[2])->format('d-m-Y');
        }

        if (is_numeric($data[12])) {
            $data[12] = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($data[12])->format('d-m-Y');
        }

        if (is_numeric($data[14])) {
            $data[14] = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($data[14])->format('d-m-Y');
        }
        return $data;
    }
}
