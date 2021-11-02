<?php

namespace GGPHP\Crm\AdmissionRegister\Providers;

use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ParentInfoRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\AdmissionRegisterRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ParentInfoRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ConfirmTransporterRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\TestInputRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AdmissionRegisterServiceProvider extends ServiceProvider
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
        $this->app->bind(AdmissionRegisterRepository::class, AdmissionRegisterRepositoryEloquent::class);
        $this->app->bind(ParentInfoRepository::class, ParentInfoRepositoryEloquent::class);
        $this->app->bind(ConfirmTransporterRepository::class, ConfirmTransporterRepositoryEloquent::class);
        $this->app->bind(TestInputRepository::class, TestInputRepositoryEloquent::class);
    }
}
