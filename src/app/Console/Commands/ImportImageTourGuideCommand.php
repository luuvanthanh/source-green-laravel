<?php

namespace App\Console\Commands;

use GGPHP\TourGuide\Repositories\Eloquent\TourGuideRepositoryEloquent;
use Illuminate\Console\Command;

class ImportImageTourGuideCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:sync-tour-guide-image';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync tour guide image';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        resolve(TourGuideRepositoryEloquent::class)->syncTourGuideImage();
    }
}
