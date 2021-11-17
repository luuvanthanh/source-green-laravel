<?php

namespace GGPHP\Crm\WebForm\Providers;

use GGPHP\Crm\WebForm\Repositories\Contracts\DataWebFormCustomerStudentInfoRepository;
use GGPHP\Crm\WebForm\Repositories\Eloquent\DataWebFormCustomerStudentInfoRepositoryEloquent;
use GGPHP\Crm\WebForm\Repositories\Contracts\DataWebFormCustomerRepository;
use GGPHP\Crm\WebForm\Repositories\Eloquent\DataWebFormCustomerRepositoryEloquent;
use GGPHP\Crm\WebForm\Repositories\Contracts\WebFormCustomerRepository;
use GGPHP\Crm\WebForm\Repositories\Contracts\WebFormCustomerProgramRepository;
use GGPHP\Crm\WebForm\Repositories\Eloquent\WebFormCustomerRepositoryEloquent;
use GGPHP\Crm\WebForm\Repositories\Eloquent\WebFormCustomerProgramRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class WebFormCustomerServiceProvider extends ServiceProvider
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
        $this->app->bind(WebFormCustomerRepository::class, WebFormCustomerRepositoryEloquent::class);
    }
}
