<?php

namespace GGPHP\Clover\Imports;

use Carbon\Carbon;
use GGPHP\Users\Models\User;
use GGPHP\WorkDeclaration\Models\WorkDeclaration;
use Maatwebsite\Excel\Concerns\ToModel;
use Webpatser\Uuid\Uuid;

class WorkDeclarationImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!is_null($row[0])) {
            $startDate = Carbon::parse($row[1])->format('Y-m-d');
            $endDate = Carbon::parse($row[2])->format('Y-m-d');

            $begin = new \DateTime($startDate);
            $end = new \DateTime($endDate);

            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end->modify('+1 day'));

            $employee = User::where("FullName", trim($row[0]))->where("Status", User::STATUS['WORKING'])->first();

            foreach ($periodDate as $date) {

                if (!is_null($employee)) {

                    WorkDeclaration::create([
                        "EmployeeId" => $employee->Id,
                        "Date" => $date->format('Y-m-d'),
                        "Time" => $row[3] . ":00"
                    ]);
                    WorkDeclaration::create([
                        "EmployeeId" => $employee->Id,
                        "Date" => $date->format('Y-m-d'),
                        "Time" => $row[4] . ":00"
                    ]);
                }
            }
        }

        return;
    }
}
