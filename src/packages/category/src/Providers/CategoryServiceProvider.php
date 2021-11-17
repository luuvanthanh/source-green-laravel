<?php

namespace GGPHP\Category\Providers;

use GGPHP\Category\Repositories\Contracts\EventTypeRepository;
use GGPHP\Category\Repositories\Contracts\LanguageRepository;
use GGPHP\Category\Repositories\Contracts\ProvinceRepository;
use GGPHP\Category\Repositories\Contracts\TouristDestinationRepository;
use GGPHP\Category\Repositories\Eloquent\EventTypeRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\LanguageRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ProvinceRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\TouristDestinationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
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
        $this->app->bind(TouristDestinationRepository::class, TouristDestinationRepositoryEloquent::class);
        $this->app->bind(EventTypeRepository::class, EventTypeRepositoryEloquent::class);
        $this->app->bind(ProvinceRepository::class, ProvinceRepositoryEloquent::class);
        $this->app->bind(LanguageRepository::class, LanguageRepositoryEloquent::class);
    }
}
