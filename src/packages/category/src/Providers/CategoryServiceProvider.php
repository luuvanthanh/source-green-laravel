<?php

namespace GGPHP\Category\Providers;

use GGPHP\Category\Repositories\Contracts\BranchRepository;
use GGPHP\Category\Repositories\Contracts\DegreeRepository;
use GGPHP\Category\Repositories\Contracts\DivisionRepository;
use GGPHP\Category\Repositories\Contracts\EducationalLevelRepository;
use GGPHP\Category\Repositories\Contracts\HolidayRepository;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaLogRepository;
use GGPHP\Category\Repositories\Contracts\ParamaterFormulaRepository;
use GGPHP\Category\Repositories\Contracts\ParamaterValueLogRepository;
use GGPHP\Category\Repositories\Contracts\ParamaterValueRepository;
use GGPHP\Category\Repositories\Contracts\ParameterTaxLogRepository;
use GGPHP\Category\Repositories\Contracts\ParameterTaxRepository;
use GGPHP\Category\Repositories\Contracts\PositionRepository;
use GGPHP\Category\Repositories\Contracts\TrainingMajorRepository;
use GGPHP\Category\Repositories\Contracts\TrainingSchoolRepository;
use GGPHP\Category\Repositories\Contracts\TypeOfContractRepository;
use GGPHP\Category\Repositories\Eloquent\BranchRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\DegreeRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\DivisionRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\EducationalLevelRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\HolidayRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParamaterFormulaLogRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParamaterFormulaRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParamaterValueLogRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParamaterValueRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParameterTaxLogRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\ParameterTaxRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\PositionRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\TrainingMajorRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\TrainingSchoolRepositoryEloquent;
use GGPHP\Category\Repositories\Eloquent\TypeOfContractRepositoryEloquent;
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
        $this->app->bind(BranchRepository::class, BranchRepositoryEloquent::class);
        $this->app->bind(HolidayRepository::class, HolidayRepositoryEloquent::class);

    }
}
