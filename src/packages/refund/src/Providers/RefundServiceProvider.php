<?php

namespace GGPHP\Refund\Providers;

use GGPHP\Refund\Repositories\Contracts\RefundDetailRepository;
use GGPHP\Refund\Repositories\Contracts\StudentRefundDetailRepository;
use GGPHP\Refund\Repositories\Contracts\RefundStudentRepository;
use GGPHP\Refund\Repositories\Contracts\RefundRepository;
use GGPHP\Refund\Repositories\Eloquents\RefundDetailRepositoryEloquent;
use GGPHP\Refund\Repositories\Eloquents\StudentRefundDetailRepositoryEloquent;
use GGPHP\Refund\Repositories\Eloquents\RefundStudentRepositoryEloquent;
use GGPHP\Refund\Repositories\Eloquents\RefundRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class RefundServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang-program');
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
        $this->app->bind(RefundRepository::class, RefundRepositoryEloquent::class);
        $this->app->bind(RefundDetailRepository::class, RefundDetailRepositoryEloquent::class);
        $this->app->bind(RefundStudentRepository::class, RefundStudentRepositoryEloquent::class);
        $this->app->bind(StudentRefundDetailRepository::class, StudentRefundDetailRepositoryEloquent::class);
    }
}
