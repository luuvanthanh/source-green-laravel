<?php

namespace GGPHP\ActivityLog\Providers;

use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\ActivityLog\Repositories\Contracts\DegreeRepository;
use GGPHP\ActivityLog\Repositories\Contracts\DivisionRepository;
use GGPHP\ActivityLog\Repositories\Contracts\EducationalLevelRepository;
use GGPHP\ActivityLog\Repositories\Contracts\HolidayRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParamaterFormulaLogRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParamaterFormulaRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParamaterValueLogRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParamaterValueRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParameterTaxLogRepository;
use GGPHP\ActivityLog\Repositories\Contracts\ParameterTaxRepository;
use GGPHP\ActivityLog\Repositories\Contracts\PositionRepository;
use GGPHP\ActivityLog\Repositories\Contracts\TrainingMajorRepository;
use GGPHP\ActivityLog\Repositories\Contracts\TrainingSchoolRepository;
use GGPHP\ActivityLog\Repositories\Contracts\TypeOfContractRepository;
use GGPHP\ActivityLog\Repositories\Eloquent\ActivityLogRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\DegreeRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\DivisionRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\EducationalLevelRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\HolidayRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParamaterFormulaLogRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParamaterFormulaRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParamaterValueLogRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParamaterValueRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParameterTaxLogRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\ParameterTaxRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\PositionRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\TrainingMajorRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\TrainingSchoolRepositoryEloquent;
use GGPHP\ActivityLog\Repositories\Eloquent\TypeOfContractRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class ActivityLogServiceProvider extends ServiceProvider
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
        $this->app->bind(TrainingSchoolRepository::class, TrainingSchoolRepositoryEloquent::class);
        $this->app->bind(TrainingMajorRepository::class, TrainingMajorRepositoryEloquent::class);
        $this->app->bind(DegreeRepository::class, DegreeRepositoryEloquent::class);
        $this->app->bind(EducationalLevelRepository::class, EducationalLevelRepositoryEloquent::class);
        $this->app->bind(ParamaterValueRepository::class, ParamaterValueRepositoryEloquent::class);
        $this->app->bind(ParamaterFormulaRepository::class, ParamaterFormulaRepositoryEloquent::class);
        $this->app->bind(ParameterTaxRepository::class, ParameterTaxRepositoryEloquent::class);
        $this->app->bind(ParamaterValueLogRepository::class, ParamaterValueLogRepositoryEloquent::class);
        $this->app->bind(ParamaterFormulaLogRepository::class, ParamaterFormulaLogRepositoryEloquent::class);
        $this->app->bind(ParameterTaxLogRepository::class, ParameterTaxLogRepositoryEloquent::class);
        $this->app->bind(TypeOfContractRepository::class, TypeOfContractRepositoryEloquent::class);
        $this->app->bind(PositionRepository::class, PositionRepositoryEloquent::class);
        $this->app->bind(DivisionRepository::class, DivisionRepositoryEloquent::class);
        $this->app->bind(ActivityLogRepository::class, ActivityLogRepositoryEloquent::class);
        $this->app->bind(HolidayRepository::class, HolidayRepositoryEloquent::class);

    }
}
