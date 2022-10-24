<?php

namespace GGPHP\ChildDevelop\Category\Providers;

use GGPHP\ChildDevelop\Category\Repositories\Contracts\AssessmentPeriodRepository;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryChildIssueRepository;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryQuestionParentRepository;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategorySkillRepository;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\LogoRepository;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\NameAssessmentPeriodRepository;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\CategoryChildIssueRepositoryEloquent;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\CategoryQuestionParentRepositoryEloquent;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\CategorySkillRepositoryEloquent;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\AssessmentPeriodRepositoryEloquent;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\LogoRepositoryEloquent;
use GGPHP\ChildDevelop\Category\Repositories\Eloquent\NameAssessmentPeriodRepositoryEloquent;
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
        $this->app->bind(CategorySkillRepository::class, CategorySkillRepositoryEloquent::class);
        $this->app->bind(CategoryChildIssueRepository::class, CategoryChildIssueRepositoryEloquent::class);
        $this->app->bind(CategoryQuestionParentRepository::class, CategoryQuestionParentRepositoryEloquent::class);
        $this->app->bind(AssessmentPeriodRepository::class, AssessmentPeriodRepositoryEloquent::class);
        $this->app->bind(NameAssessmentPeriodRepository::class, NameAssessmentPeriodRepositoryEloquent::class);
        $this->app->bind(LogoRepository::class, LogoRepositoryEloquent::class);
    }
}
