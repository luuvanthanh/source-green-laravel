<?php

namespace GGPHP\Fee\Providers;

use GGPHP\Fee\Repositories\Contracts\ClassTypeRepository;
use GGPHP\Fee\Repositories\Contracts\FeeRepository;
use GGPHP\Fee\Repositories\Contracts\PaymentFormRepository;
use GGPHP\Fee\Repositories\Contracts\StudentObjectRepository;
use GGPHP\Fee\Repositories\Eloquent\ClassTypeRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\FeeRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\PaymentFormRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\StudentObjectRepositoryEloquent;
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
        $this->app->bind(ClassTypeRepository::class, ClassTypeRepositoryEloquent::class);
        $this->app->bind(FeeRepository::class, FeeRepositoryEloquent::class);
        $this->app->bind(PaymentFormRepository::class, PaymentFormRepositoryEloquent::class);
        $this->app->bind(StudentObjectRepository::class, StudentObjectRepositoryEloquent::class);
    }
}
