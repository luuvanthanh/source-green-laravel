<?php

namespace GGPHP\Crm\SsoAccount\Providers;

use GGPHP\Crm\SsoAccount\Repositories\Contracts\SsoAccountRepository;
use GGPHP\Crm\SsoAccount\Repositories\Eloquent\SsoAccountRepositoryEloquent;

use Illuminate\Support\ServiceProvider;

class SsoAccountServiceProvider extends ServiceProvider
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
        $this->app->bind(SsoAccountRepository::class, SsoAccountRepositoryEloquent::class);
    }
}
