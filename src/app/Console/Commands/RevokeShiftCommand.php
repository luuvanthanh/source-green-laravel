<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Models\RevokeShift;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Repositories\Eloquent\TimekeepingRepositoryEloquent;
use GGPHP\Users\Models\User;
use Illuminate\Console\Command;

class RevokeShiftCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revoke_shift';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List revoke shift daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(TimekeepingRepositoryEloquent $timekeepingRepositoryEloquent)
    {
        parent::__construct();
        $this->timekeepingRepositoryEloquent = $timekeepingRepositoryEloquent;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $employee = User::get();

        $now = Carbon::now();

        $date = $now->subDay()->format('Y-m-d');

        foreach ($employee as $value) {
            $employeeHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($value->Id, $date, $date);

            if (!empty($employeeHasWorkShift)) {
                $timekepping = Timekeeping::where('EmployeeId', $value->Id)->whereDate('AttendedAt', $date)->get();

                if (empty(count($timekepping))) {

                    $absentType = AbsentType::whereIn('Type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE, AbsentType::QUIT_WORK])->pluck('Id')->toArray();

                    $absent = Absent::where('EmployeeId', $value->Id)->whereIn('AbsentTypeId', $absentType)->where(function ($q2) use ($date) {
                        $q2->where([['StartDate', '<=', $date], ['EndDate', '>=', $date]])
                            ->orWhere([['StartDate', '>=', $date], ['StartDate', '<=', $date]])
                            ->orWhere([['EndDate', '>=', $date], ['EndDate', '<=', $date]]);
                    })->get();

                    $data = [
                        "EmployeeId" => $value->Id,
                        "ShiftId" => $employeeHasWorkShift[$date][0]['ShiftId'],
                        "DateViolation" => $date,
                    ];

                    if (empty(count($absent))) {
                        $checkRevokeShift = RevokeShift::where('EmployeeId', $data['EmployeeId'])->where('DateViolation', $data['DateViolation'])->first();

                        if (is_null($checkRevokeShift)) {
                            $revokeShift = RevokeShift::create($data);
                        }
                    }
                }

                $dataTimeKeepingReport = [
                    'employeeId' => $value->Id,
                    'startDate' => $date,
                    'endDate' => $date,
                ];

                $getTimekeeping = $this->timekeepingRepositoryEloquent->timekeepingReport($dataTimeKeepingReport);

                if (isset($getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]) && $getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]['timekeepingReport'] == 0 && !empty(count($timekepping))) {
                    $shift = Shift::findOrFail($employeeHasWorkShift[$date][0]['ShiftId']);
                    $shiftCode = $shift->shift_code;
                    $timeShift = [];
                    foreach ($employeeHasWorkShift[$date] as $key => $time) {
                        $timeShift[] = $time['StartTime'] . ' - ' . $time['EndTime'];
                    }

                    $existInvalid = LateEarly::where('EmployeeId', $value->Id)
                        ->where('Status', LateEarly::INVALID)
                        ->whereDate('Date', $date)
                        ->get();

                    if (count($existInvalid) == 0) {
                        $data['Date'] = $date;
                        $data['CreationTime'] = $date;
                        $data['EmployeeId'] = $value->Id;
                        $data['ShiftCode'] = $shiftCode;
                        $data['TimeShift'] = implode(',', $timeShift);
                        $data['Status'] = LateEarly::INVALID;
                        LateEarly::create($data);
                    }
                }
            }

        }

        return 0;
    }
}
