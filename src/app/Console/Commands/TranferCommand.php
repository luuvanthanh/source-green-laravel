<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use GGPHP\Division\Models\RankPositionInformation;
use GGPHP\Users\Models\User;
use Illuminate\Console\Command;

class TranferCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tranfer';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update role for user by tranfer daily';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $now = Carbon::now();

        $rank = RankPositionInformation::where('start_date', $now->format('Y-m-d'))->get();

        foreach ($rank as $value) {
            $user = User::find($value->user_id);
            $user->syncRoles($value->role_id);
        }

        return 0;
    }
}
