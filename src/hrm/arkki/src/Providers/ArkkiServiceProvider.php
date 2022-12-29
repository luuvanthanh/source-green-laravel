<?php

namespace GGPHP\Arkki\Providers;

use GGPHP\Arkki\Repositories\Contracts\TeachingShiftRepository;
use GGPHP\Arkki\Repositories\Eloquent\TeachingShiftRepositoryEloquent;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as AuthServiceProvider;

class ArkkiServiceProvider extends AuthServiceProvider
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
        $this->app->bind(TeachingShiftRepository::class, TeachingShiftRepositoryEloquent::class);
    }
}
