<?php

namespace GGPHP\Crm\Province\Providers;

use GGPHP\Crm\Province\Repositories\Contracts\CityRepository;
use GGPHP\Crm\Province\Repositories\Contracts\DistrictRepository;
use GGPHP\Crm\Province\Repositories\Contracts\TownWardRepository;
use GGPHP\Crm\Province\Repositories\Eloquent\CityRepositoryEloquent;
use GGPHP\Crm\Province\Repositories\Eloquent\DistrictRepositoryEloquent;
use GGPHP\Crm\Province\Repositories\Eloquent\TownWardRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ProvinceServiceProvider extends ServiceProvider
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
        $this->app->bind(CityRepository::class, CityRepositoryEloquent::class);
        $this->app->bind(DistrictRepository::class, DistrictRepositoryEloquent::class);
        $this->app->bind(TownWardRepository::class, TownWardRepositoryEloquent::class);
    }
}
