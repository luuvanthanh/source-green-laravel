<?php

namespace GGPHP\Crm\AdmissionRegister\Providers;

use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ChildEvaluateInfoRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ParentInfoRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\AdmissionRegisterRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ParentInfoRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ConfirmTransporterRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\MedicalInfoRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ProfileInfoRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ChildEvaluateInfoRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ConfirmTransporterRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\MedicalInfoRepositoryEloquent;
use GGPHP\Crm\AdmissionRegister\Repositories\Eloquent\ProfileInfoRepositoryEloquent;
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
        $this->app->bind(MedicalInfoRepository::class, MedicalInfoRepositoryEloquent::class);
        $this->app->bind(ProfileInfoRepository::class, ProfileInfoRepositoryEloquent::class);
        $this->app->bind(ChildEvaluateInfoRepository::class, ChildEvaluateInfoRepositoryEloquent::class);
    }
}
