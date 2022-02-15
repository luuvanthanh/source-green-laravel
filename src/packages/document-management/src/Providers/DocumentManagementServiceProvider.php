<?php

namespace GGPHP\DocumentManagement\Providers;

use GGPHP\DocumentManagement\Repositories\Contracts\DocumentManagementRepository;
use GGPHP\DocumentManagement\Repositories\Eloquents\DocumentManagementRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class DocumentManagementServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
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
        $this->app->bind(DocumentManagementRepository::class, DocumentManagementRepositoryEloquent::class);
    }
}
