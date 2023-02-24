<?php

namespace GGPHP\StudyProgram\QuarterReport\Providers;

use GGPHP\StudyProgram\QuarterReport\Repositories\Contracts\QuarterReportRepository;
use GGPHP\StudyProgram\QuarterReport\Repositories\Eloquent\QuarterReportRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class QuarterReportServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(QuarterReportRepository::class, QuarterReportRepositoryEloquent::class);
    }
}
