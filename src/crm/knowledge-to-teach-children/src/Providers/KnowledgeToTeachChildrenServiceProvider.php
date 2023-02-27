<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Providers;

use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\CategoryKnowledgeToTeachChildrenRepository;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Eloquent\CategoryKnowledgeToTeachChildrenRepositoryEloquent;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\PostKnowledgeToTeachChildrenRepository;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Eloquent\PostKnowledgeToTeachChildrenRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class KnowledgeToTeachChildrenServiceProvider extends ServiceProvider
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
        $this->app->bind(CategoryKnowledgeToTeachChildrenRepository::class, CategoryKnowledgeToTeachChildrenRepositoryEloquent::class);
        $this->app->bind(PostKnowledgeToTeachChildrenRepository::class, PostKnowledgeToTeachChildrenRepositoryEloquent::class);
    }
}
