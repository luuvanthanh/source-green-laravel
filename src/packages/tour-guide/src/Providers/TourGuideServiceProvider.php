<?php

namespace GGPHP\TourGuide\Providers;

use GGPHP\TourGuide\Repositories\Contracts\TourGuideRepository;
use GGPHP\TourGuide\Repositories\Eloquent\TourGuideRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class TourGuideServiceProvider extends ServiceProvider
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
        $this->app->bind(TourGuideRepository::class, TourGuideRepositoryEloquent::class);
    }
}
