<?php

namespace GGPHP\Clover\Imports;

use Carbon\Carbon;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Users\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;

class TimekeepingImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!is_null($row[0])) {
            $startDate = Carbon::createFromFormat('d/m/Y', $row[1])->format('Y-m-d');;
            $endDate = Carbon::createFromFormat('d/m/Y', $row[2])->format('Y-m-d');;
            $begin = new \DateTime($startDate);
            $end = new \DateTime($endDate);
            $intervalDate = \DateInterval::createFromDateString('1 day');
            $periodDate = new \DatePeriod($begin, $intervalDate, $end->modify('+1 day'));

            $employee = User::where('FullName', trim($row[0]))->where('Status', User::STATUS['WORKING'])->first();

            foreach ($periodDate as $date) {
                if (!is_null($employee)) {
                    Timekeeping::create([
                        'EmployeeId' => $employee->Id,
                        'DeviceId' => '080fd2dd-5457-4991-a000-956681a360ea',
                        'Type' => 'FINGERPRINT',
                        'AttendedAt' => $date->format('Y-m-d') . $row[3],
                        'TrackingType' => 'CHECK_IN'
                    ]);
                    Timekeeping::create([
                        'EmployeeId' => $employee->Id,
                        'DeviceId' => '080fd2dd-5457-4991-a000-956681a360ea',
                        'Type' => 'FINGERPRINT',
                        'AttendedAt' => $date->format('Y-m-d') . $row[4],
                        'TrackingType' => 'CHECK_OUT'
                    ]);
                }
            }
        }
    }
}
