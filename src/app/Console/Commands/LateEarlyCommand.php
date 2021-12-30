<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use GGPHP\Attendance\Repositories\Eloquents\AttendanceRepositoryEloquent;
use Illuminate\Console\Command;

class LateEarlyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto insert attendance student daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(AttendanceRepositoryEloquent $attendanceRepositoryEloquent)
    {
        parent::__construct();
        $this->attendanceRepositoryEloquent = $attendanceRepositoryEloquent;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $now = Carbon::now();

        $date = Carbon::now('GMT+7')->format('Y-m-d');

        $attributes = [
            'date' => $date,
        ];

        $this->attendanceRepositoryEloquent->attendanceCrontab($attributes);

        return 0;
    }
}
