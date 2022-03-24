<?php

namespace GGPHP\Crm\Marketing\Providers;

use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleCommentInfoRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleReactionInfoRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingStudentInfoRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\DataMarketingStudentInfoRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Contracts\DataMarketingRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\DataMarketingRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Contracts\ArticleRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\MarketingProgramRepository;
use GGPHP\Crm\Marketing\Repositories\Contracts\PostFacebookInfoRepository;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleCommentInfoRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleReactionInfoRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Eloquent\MarketingProgramRepositoryEloquent;
use GGPHP\Crm\Marketing\Repositories\Eloquent\PostFacebookInfoRepositoryEloquent;
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
        $this->app->bind(DataMarketingStudentInfoRepository::class, DataMarketingStudentInfoRepositoryEloquent::class);
        $this->app->bind(ArticleRepository::class, ArticleRepositoryEloquent::class);
        $this->app->bind(PostFacebookInfoRepository::class, PostFacebookInfoRepositoryEloquent::class);
        $this->app->bind(ArticleReactionInfoRepository::class, ArticleReactionInfoRepositoryEloquent::class);
        $this->app->bind(ArticleCommentInfoRepository::class, ArticleCommentInfoRepositoryEloquent::class);
    }
}
