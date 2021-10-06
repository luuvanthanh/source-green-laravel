<?php

namespace GGPHP\Crm\Marketing\Providers;

use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\DataMarketingRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\MarketingProgramRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Eloquent\MarketingProgramRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class MarketingServiceProvider extends ServiceProvider
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
        $this->app->bind(DataMarketingRepository::class, DataMarketingRepositoryEloquent::class);
        $this->app->bind(MarketingProgramRepository::class, MarketingProgramRepositoryEloquent::class);
        $this->app->bind(ArticleRepository::class, ArticleRepositoryEloquent::class);
    }
}
