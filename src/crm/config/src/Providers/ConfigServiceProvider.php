<?php

namespace GGPHP\Crm\Config\Providers;

use GGPHP\Crm\Config\Repositories\Contracts\ConfigMedicalDeclareRepository;
use GGPHP\Crm\Config\Repositories\Contracts\ConfigProfileInfoRepository;
use GGPHP\Crm\Config\Repositories\Eloquent\ConfigMedicalDeclareRepositoryEloquent;
use GGPHP\Crm\Config\Repositories\Eloquent\ConfigProfileInfoRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
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
        $this->app->bind(ConfigMedicalDeclareRepository::class, ConfigMedicalDeclareRepositoryEloquent::class);
        $this->app->bind(ConfigProfileInfoRepository::class, ConfigProfileInfoRepositoryEloquent::class);
    }
}
