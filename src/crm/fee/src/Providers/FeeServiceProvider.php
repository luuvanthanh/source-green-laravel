<?php

namespace GGPHP\Crm\Fee\Providers;

use GGPHP\Crm\Fee\Repositories\Contracts\ClassTypeRepository;
use GGPHP\Crm\Fee\Repositories\Contracts\FeeRepository;
use GGPHP\Crm\Fee\Repositories\Contracts\PaymentFormRepository;
use GGPHP\Crm\Fee\Repositories\Contracts\SchoolYearRepository;
use GGPHP\Crm\Fee\Repositories\Eloquent\ClassTypeRepositoryEloquent;
use GGPHP\Crm\Fee\Repositories\Eloquent\FeeRepositoryEloquent;
use GGPHP\Crm\Fee\Repositories\Eloquent\PaymentFormRepositoryEloquent;
use GGPHP\Crm\Fee\Repositories\Eloquent\SchoolYearRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class FeeServiceProvider extends ServiceProvider
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
        $this->app->bind(SchoolYearRepository::class, SchoolYearRepositoryEloquent::class);
        $this->app->bind(ClassTypeRepository::class, ClassTypeRepositoryEloquent::class);
        $this->app->bind(FeeRepository::class, FeeRepositoryEloquent::class);
        $this->app->bind(PaymentFormRepository::class, PaymentFormRepositoryEloquent::class);
    }
}
