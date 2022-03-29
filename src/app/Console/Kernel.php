<?php

namespace App\Console;

use App\Console\Commands\ImportImageTourGuideCommand;
use App\Console\Commands\ImportTourGuideCommand;
use App\Console\Commands\ImportTravelAgencyCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ImportTourGuideCommand::class,
        ImportImageTourGuideCommand::class,
        ImportTravelAgencyCommand::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('command:sync-tour-guide')->dailyAt('00:00');
        $schedule->command('command:command:sync-travel-agency')->dailyAt('00:15');
        $schedule->command('command:sync-tour-guide-image')->dailyAt('00:30');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
