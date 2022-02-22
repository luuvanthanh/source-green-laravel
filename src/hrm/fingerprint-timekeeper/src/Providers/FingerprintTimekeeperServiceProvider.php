<?php

namespace GGPHP\FingerprintTimekeeper\Providers;

use GGPHP\FingerprintTimekeeper\Repositories\Contracts\FingerprintTimekeeperRepository;
use GGPHP\FingerprintTimekeeper\Repositories\Eloquent\FingerprintTimekeeperRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class FingerprintTimekeeperServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-fingerprint-timekeeper');
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
        $this->app->bind(FingerprintTimekeeperRepository::class, FingerprintTimekeeperRepositoryEloquent::class);
    }
}
