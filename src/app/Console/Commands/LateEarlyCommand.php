<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use GGPHP\LateEarly\Repositories\Eloquent\LateEarlyRepositoryEloquent;
// use GGPHP\Users\Models\User;
use Illuminate\Console\Command;

class LateEarlyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'late_early';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto insert late early user daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(LateEarlyRepositoryEloquent $lateEarlyRepositoryEloquent)
    {
        parent::__construct();
        $this->lateEarlyRepositoryEloquent = $lateEarlyRepositoryEloquent;

    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $now = Carbon::now();

        $date = Carbon::now()->format('Y-m-d');

        // $date = $now->subDay()->format('Y-m-d');
        // $users = User::whereHas('timekeeping', function ($query) use ($date) {
        //     $query->whereDate('attended_at', date($date))
        //         ->orderBy('attended_at');
        // })->with(['timekeeping' => function ($query) use ($date) {
        //     $query->whereDate('attended_at', date($date))
        //         ->orderBy('attended_at');
        // }])->get();

        // foreach ($users as $user) {
        //     $this->lateEarlyRepositoryEloquent->getLateEarly($user, $date);
        // }

        $attributes = [
            "date" => $date,
        ];

        $this->lateEarlyRepositoryEloquent->lateEarlyReportNew($attributes);

        return 0;
    }
}
