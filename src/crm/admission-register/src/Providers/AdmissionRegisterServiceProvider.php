<?php

namespace GGPHP\Crm\AdmissionRegister\Providers;

use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\AdmissionRegisterRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ConfirmTransporterRepositoryEloquent;
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
        $this->app->bind(ConfirmTransporterRepository::class, ConfirmTransporterRepositoryEloquent::class);
    }
}
