<?php

namespace GGPHP\Profile\Providers;

use GGPHP\Profile\Repositories\Contracts\HealthInsuranceRepository;
use GGPHP\Profile\Repositories\Contracts\InsurranceRepository;
use GGPHP\Profile\Repositories\Contracts\LabourContractRepository;
use GGPHP\Profile\Repositories\Contracts\ProbationaryContractRepository;
use GGPHP\Profile\Repositories\Contracts\SabbaticalLeaveRepository;
use GGPHP\Profile\Repositories\Contracts\SeasonalContractRepository;
use GGPHP\Profile\Repositories\Eloquent\HealthInsuranceRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\InsurranceRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\LabourContractRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\ProbationaryContractRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\SabbaticalLeaveRepositoryEloquent;
use GGPHP\Profile\Repositories\Eloquent\SeasonalContractRepositoryEloquent;
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
        $this->app->bind(InsurranceRepository::class, InsurranceRepositoryEloquent::class);
        $this->app->bind(SabbaticalLeaveRepository::class, SabbaticalLeaveRepositoryEloquent::class);
        $this->app->bind(HealthInsuranceRepository::class, HealthInsuranceRepositoryEloquent::class);
        $this->app->bind(SeasonalContractRepository::class, SeasonalContractRepositoryEloquent::class);
    }
}
