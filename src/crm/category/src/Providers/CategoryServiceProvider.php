<?php

namespace GGPHP\Crm\Category\Providers;

use GGPHP\Crm\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryEventRepository;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryRelationshipRepository;
use GGPHP\Crm\Category\Repositories\Contracts\CategorySkillRepository;
use GGPHP\Crm\Category\Repositories\Contracts\SearchSourceRepository;
use GGPHP\Crm\Category\Repositories\Contracts\StatusAdmissionRegisterRepository;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentPotentialRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusParentPotentialRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Contracts\StatusParentLeadRepository;
use GGPHP\Crm\Category\Repositories\Contracts\TagRepository;
use GGPHP\Crm\Category\Repositories\Eloquent\BranchRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\CategoryEventRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\CategoryRelationshipRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\CategorySkillRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\SearchSourceRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusAdmissionRegisterRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\StatusParentLeadRepositoryEloquent;
use GGPHP\Crm\Category\Repositories\Eloquent\TagRepositoryEloquent;
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
        $this->app->bind(StatusParentPotentialRepository::class, StatusParentPotentialRepositoryEloquent::class);
        $this->app->bind(StatusParentLeadRepository::class, StatusParentLeadRepositoryEloquent::class);
        $this->app->bind(TagRepository::class, TagRepositoryEloquent::class);
        $this->app->bind(SearchSourceRepository::class, SearchSourceRepositoryEloquent::class);
        $this->app->bind(StatusAdmissionRegisterRepository::class, StatusAdmissionRegisterRepositoryEloquent::class);
        $this->app->bind(BranchRepository::class, BranchRepositoryEloquent::class);
        $this->app->bind(CategoryEventRepository::class, CategoryEventRepositoryEloquent::class);
        $this->app->bind(CategoryRelationshipRepository::class, CategoryRelationshipRepositoryEloquent::class);
        $this->app->bind(CategorySkillRepository::class, CategorySkillRepositoryEloquent::class);
    }
}
