<?php

namespace GGPHP\AiService\Providers;

use GGPHP\AiService\Repositories\Contracts\AiServiceRepository;
use GGPHP\AiService\Repositories\Eloquent\AiServiceRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AiServiceServiceProvider extends ServiceProvider
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
        $this->app->bind(AiServiceRepository::class, AiServiceRepositoryEloquent::class);
    }
}
