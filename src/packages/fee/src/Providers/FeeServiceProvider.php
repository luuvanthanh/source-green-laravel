<?php

namespace GGPHP\Fee\Providers;

use GGPHP\Fee\Repositories\Contracts\ChargeStudentRepository;
use GGPHP\Fee\Repositories\Contracts\ChargeOldStudentRepository;
use GGPHP\Fee\Repositories\Contracts\ClassTypeRepository;
use GGPHP\Fee\Repositories\Contracts\FeePolicieRepository;
use GGPHP\Fee\Repositories\Contracts\FeeRepository;
use GGPHP\Fee\Repositories\Contracts\PaymentFormRepository;
use GGPHP\Fee\Repositories\Contracts\PotentialStudentRepository;
use GGPHP\Fee\Repositories\Contracts\SchoolYearRepository;
use GGPHP\Fee\Repositories\Contracts\StudentObjectRepository;
use GGPHP\Fee\Repositories\Contracts\TuitionRepository;
use GGPHP\Fee\Repositories\Eloquent\ChargeOldStudentRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\ChargeStudentRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\ClassTypeRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\FeePolicieRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\FeeRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\PaymentFormRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\PotentialStudentRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\SchoolYearRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\StudentObjectRepositoryEloquent;
use GGPHP\Fee\Repositories\Eloquent\TuitionRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class FeeServiceProvider extends ServiceProvider
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
        $this->app->bind(ClassTypeRepository::class, ClassTypeRepositoryEloquent::class);
        $this->app->bind(FeeRepository::class, FeeRepositoryEloquent::class);
        $this->app->bind(PaymentFormRepository::class, PaymentFormRepositoryEloquent::class);
        $this->app->bind(StudentObjectRepository::class, StudentObjectRepositoryEloquent::class);
        $this->app->bind(SchoolYearRepository::class, SchoolYearRepositoryEloquent::class);
        $this->app->bind(FeePolicieRepository::class, FeePolicieRepositoryEloquent::class);
        $this->app->bind(ChargeStudentRepository::class, ChargeStudentRepositoryEloquent::class);
        $this->app->bind(ChargeOldStudentRepository::class, ChargeOldStudentRepositoryEloquent::class);
        $this->app->bind(PotentialStudentRepository::class, PotentialStudentRepositoryEloquent::class);
        $this->app->bind(TuitionRepository::class, TuitionRepositoryEloquent::class);
    }
}
