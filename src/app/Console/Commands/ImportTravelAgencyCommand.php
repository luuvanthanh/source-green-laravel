<?php

namespace App\Console\Commands;

use GGPHP\TravelAgency\Repositories\Eloquent\TravelAgencyRepositoryEloquent;
use Illuminate\Console\Command;

class ImportTravelAgencyCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:sync-travel-agency';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync travel agency';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        resolve(TravelAgencyRepositoryEloquent::class)->syncTravelAgency();
    }
}
