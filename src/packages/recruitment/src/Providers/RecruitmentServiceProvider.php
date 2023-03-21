<?php

namespace GGPHP\Recruitment\Providers;

use GGPHP\Recruitment\Repositories\Contracts\RecruitmentLevelRepository;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentConfigurationRepository;
use GGPHP\Recruitment\Repositories\Contracts\RecruitmentManagerRepository;
use GGPHP\Recruitment\Repositories\Eloquent\RecruitmentLevelRepositoryEloquent;
use GGPHP\Recruitment\Repositories\Eloquent\RecruitmentConfigurationRepositoryEloquent;
use GGPHP\Recruitment\Repositories\Eloquent\RecruitmentManagerRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class RecruitmentServiceProvider extends ServiceProvider
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
        $this->app->bind(RecruitmentLevelRepository::class, RecruitmentLevelRepositoryEloquent::class);
        $this->app->bind(RecruitmentConfigurationRepository::class, RecruitmentConfigurationRepositoryEloquent::class);
        $this->app->bind(RecruitmentManagerRepository::class, RecruitmentManagerRepositoryEloquent::class);
    }
}
