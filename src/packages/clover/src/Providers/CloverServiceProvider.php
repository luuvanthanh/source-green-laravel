<?php

namespace GGPHP\Clover\Providers;

use GGPHP\Clover\Repositories\Contracts\ClassRepository;
use GGPHP\Clover\Repositories\Contracts\ParentRepository;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Clover\Repositories\Eloquent\ClassRepositoryEloquent;
use GGPHP\Clover\Repositories\Eloquent\ParentRepositoryEloquent;
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
        $this->app->bind(ParentRepository::class, ParentRepositoryEloquent::class);
        $this->app->bind(ClassRepository::class, ClassRepositoryEloquent::class);
    }
}
