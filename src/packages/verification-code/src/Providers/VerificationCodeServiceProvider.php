<?php

namespace GGPHP\VerificationCode\Providers;

use GGPHP\VerificationCode\Repositories\Contracts\VerificationCodeRepository;
use GGPHP\VerificationCode\Repositories\Eloquent\VerificationCodeRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class VerificationCodeServiceProvider extends ServiceProvider
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
        $this->app->bind(VerificationCodeRepository::class, VerificationCodeRepositoryEloquent::class);
    }
}
