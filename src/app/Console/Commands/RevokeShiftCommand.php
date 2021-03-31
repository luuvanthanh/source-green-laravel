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
        $user = User::get();

        $now = Carbon::now();

        $date = $now->subDay()->format('Y-m-d');

        foreach ($user as $value) {

            $userHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($value->id, $date, $date);

            if (!empty($userHasWorkShift)) {
                $timekepping = Timekeeping::where('user_id', $value->id)->whereDate('attended_at', $date)->get();

                if (empty(count($timekepping))) {

                    $absentType = AbsentType::whereIn('type', [AbsentType::ANNUAL_LEAVE, AbsentType::UNPAID_LEAVE, AbsentType::QUIT_WORK])->pluck('id')->toArray();
                    $absentType2 = AbsentType::whereIn('type', [AbsentType::TYPE_OFF, AbsentType::AWOL])->pluck('id')->toArray();

                    $absent = Absent::where('user_id', $value->id)->whereIn('absent_type_id', $absentType)->where(function ($q2) use ($date) {
                        $q2->where([['start_date', '<=', $date], ['end_date', '>=', $date]])
                            ->orWhere([['start_date', '>=', $date], ['start_date', '<=', $date]])
                            ->orWhere([['end_date', '>=', $date], ['end_date', '<=', $date]]);
                    })->approved()->get();
                    $absent2 = Absent::where('user_id', $value->id)->whereIn('absent_type_id', $absentType2)->where(function ($q2) use ($date) {
                        $q2->where([['start_date', '<=', $date], ['end_date', '>=', $date]])
                            ->orWhere([['start_date', '>=', $date], ['start_date', '<=', $date]])
                            ->orWhere([['end_date', '>=', $date], ['end_date', '<=', $date]]);
                    })->get();
                    $data = [
                        "user_id" => $value->id,
                        "shift_id" => $userHasWorkShift[$date][0]['shift_id'],
                        "date_violation" => $date,
                    ];

                    if (empty(count($absent)) && empty(count($absent2))) {
                        $checkRevokeShift = RevokeShift::where('user_id', $data['user_id'])->where('date_violation', $data['date_violation'])->first();

                        if (is_null($checkRevokeShift)) {
                            $revokeShift = RevokeShift::create($data);
                        }
                    }
                }

                $getTimekeeping = $this->timekeepingRepositoryEloquent->timekeepingReport($value->id, null, null, $date, $date, null, true);

                if (isset($getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]) && $getTimekeeping['data'][0]['attributes']['timeKeepingReport'][0]['timekeepingReport'] == 0 && !empty(count($timekepping))) {
                    $checkRankPosition = $value->listRankPositionInformationHistory->filter(function ($item) use ($date) {
                        $start_date = $item->start_date->format('Y-m-d');
                        $end_date = !is_null($item->end_date) ? $item->end_date->format('Y-m-d') : null;

                        return ($start_date <= $date && $end_date >= $date) || ($start_date <= $date && $end_date == null);
                    })->first();

                    $shift = Shift::findOrFail($userHasWorkShift[$date][0]['shift_id']);
                    $shiftCode = $shift->shift_code;
                    $timeShift = [];
                    foreach ($userHasWorkShift[$date] as $key => $time) {
                        $timeShift[] = $time['start_time'] . ' - ' . $time['end_time'];
                    }

                    $existInvalid = LateEarly::where('user_id', $value->id)
                        ->where('status', LateEarly::INVALID)
                        ->whereDate('date', $date)
                        ->get();

                    if (count($existInvalid) == 0) {
                        $data['date'] = $date;
                        $data['created_at'] = $date;
                        $data['user_id'] = $value->id;
                        $data['shift_code'] = $shiftCode;
                        $data['work_store'] = $shift->store_id;
                        $data['time_shift'] = implode(',', $timeShift);
                        $data['status'] = LateEarly::INVALID;
                        $data['store_id'] = $checkRankPosition->store_id;
                        LateEarly::create($data);
                    }
                }
            }
        }

        return 0;
    }
}
