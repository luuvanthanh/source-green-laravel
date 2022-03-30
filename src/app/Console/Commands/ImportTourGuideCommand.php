<?php

namespace App\Console\Commands;

use GGPHP\TourGuide\Repositories\Eloquent\TourGuideRepositoryEloquent;
use Illuminate\Console\Command;

class ImportTourGuideCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:sync-tour-guide';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync tour guide';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        resolve(TourGuideRepositoryEloquent::class)->importProjectFromOpenProject();
    }
}
