<?php

namespace GGPHP\Crm\ChildDevelop\Providers;

use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategoryChildIssueRepository;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategoryQuestionParentRepository;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategorySkillRepository;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\ChildEvaluateRepository;
use GGPHP\Crm\ChildDevelop\Repositories\Eloquent\CategoryChildIssueRepositoryEloquent;
use GGPHP\Crm\ChildDevelop\Repositories\Eloquent\CategoryQuestionParentRepositoryEloquent;
use GGPHP\Crm\ChildDevelop\Repositories\Eloquent\CategorySkillRepositoryEloquent;
use GGPHP\Crm\ChildDevelop\Repositories\Eloquent\ChildEvaluateRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ChildDevelopServiceProvider extends ServiceProvider
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
        $this->app->bind(CategorySkillRepository::class, CategorySkillRepositoryEloquent::class);
        $this->app->bind(CategoryChildIssueRepository::class, CategoryChildIssueRepositoryEloquent::class);
        $this->app->bind(CategoryQuestionParentRepository::class, CategoryQuestionParentRepositoryEloquent::class);
        $this->app->bind(ChildEvaluateRepository::class, ChildEvaluateRepositoryEloquent::class);
    }
}
