<?php

namespace GGPHP\Children\Providers;

use GGPHP\Children\Repositories\Contracts\ChildrenRepository;
use GGPHP\Children\Repositories\Eloquents\ChildrenRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ChildrenServiceProvider extends ServiceProvider
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
            $this->loadMigrationsFrom(__DIR__ . '/../../databases/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ChildrenRepository::class, ChildrenRepositoryEloquent::class);
    }
}
