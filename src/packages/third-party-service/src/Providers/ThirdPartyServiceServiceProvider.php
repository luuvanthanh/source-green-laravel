<?php

namespace GGPHP\ThirdPartyService\Providers;

use GGPHP\ThirdPartyService\Repositories\Contracts\ThirdPartyServiceRepository;
use GGPHP\ThirdPartyService\Repositories\Eloquent\ThirdPartyServiceRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ThirdPartyServiceServiceProvider extends ServiceProvider
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
        $this->app->bind(ThirdPartyServiceRepository::class, ThirdPartyServiceRepositoryEloquent::class);
    }
}
