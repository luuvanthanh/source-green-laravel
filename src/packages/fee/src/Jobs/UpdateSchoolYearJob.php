<?php

namespace GGPHP\Fee\Jobs;

use GGPHP\Fee\Models\SchoolYear;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateSchoolYearJob implements ShouldQueue
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
        $now = now()->format('Y-m-d');

        SchoolYear::whereNotIn('Id', function ($query) use ($now) {
            $query->select('Id')->from('fee.SchoolYears')->whereDate('StartDate', '<=', $now)->whereDate('EndDate', '>=', $now);
        })->where('IsCheck', true)->update(['IsCheck' => false]);
    }
}
