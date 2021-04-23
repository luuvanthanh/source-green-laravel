<?php

namespace GGPHP\Clover\Providers;

use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as AuthServiceProvider;

class CloverServiceProvider extends AuthServiceProvider
{

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {

    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(StudentRepository::class, StudentRepositoryEloquent::class);
    }
}
