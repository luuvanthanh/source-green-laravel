<?php

namespace GGPHP\Tariff\PaymentPlan\Providers;

use GGPHP\Tariff\PaymentPlan\Repositories\Contracts\PaymentPlanRepository;
use GGPHP\Tariff\PaymentPlan\Repositories\Eloquent\PaymentPlanRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class PaymentPlanServiceProvider extends ServiceProvider
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
        $this->app->bind(PaymentPlanRepository::class, PaymentPlanRepositoryEloquent::class);
    }
}
