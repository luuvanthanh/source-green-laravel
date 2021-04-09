<?php

namespace GGPHP\Profile\Providers;

use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use GGPHP\Profile\Repositories\Eloquent\LabourContractRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\ProbationaryContractRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ProfileServiceProvider extends ServiceProvider
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
        $this->app->bind(LabourContractRepository::class, LabourContractRepositoryEloquent::class);
        $this->app->bind(ProbationaryContractRepository::class, ProbationaryContractRepositoryEloquent::class);
    }
}
