<?php

namespace GGPHP\Attendance\Jobs;

use GGPHP\Attendance\Repositories\Eloquents\AttendanceRepositoryEloquent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AttendanceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        resolve(AttendanceRepositoryEloquent::class)->attendanceCrontab([
            'date' => now()->format('Y-m-d')
        ]);
    }
}
