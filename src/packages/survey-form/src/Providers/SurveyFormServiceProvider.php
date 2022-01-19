<?php

namespace GGPHP\SurveyForm\Providers;

use GGPHP\SurveyForm\Repositories\Contracts\HandleWorkRepository;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormRepository;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormResultRepository;
use GGPHP\SurveyForm\Repositories\Eloquent\HandleWorkRepositoryEloquent;
use GGPHP\SurveyForm\Repositories\Eloquent\SurveyFormRepositoryEloquent;
use GGPHP\SurveyForm\Repositories\Eloquent\SurveyFormResultRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class SurveyFormServiceProvider extends ServiceProvider
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
        $this->app->bind(SurveyFormRepository::class, SurveyFormRepositoryEloquent::class);
        $this->app->bind(SurveyFormResultRepository::class, SurveyFormResultRepositoryEloquent::class);
        $this->app->bind(HandleWorkRepository::class, HandleWorkRepositoryEloquent::class);
    }
}
