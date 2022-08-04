<?php

namespace App\Providers;

use CloudCreativity\LaravelJsonApi\LaravelJsonApi;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Models\FeePolicie;
use GGPHP\Fee\Models\PaymentForm;
use GGPHP\Fee\Observers\ChargeOldStudentObserver;
use GGPHP\Fee\Observers\ClassTypeObserver;
use GGPHP\Fee\Observers\FeeObserver;
use GGPHP\Fee\Observers\FeePolicieObserver;
use GGPHP\Fee\Observers\PaymentFormObserver;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        LaravelJsonApi::defaultApi('v1');

        //Observer
        ClassType::observe(ClassTypeObserver::class);
        Fee::observe(FeeObserver::class);
        PaymentForm::observe(PaymentFormObserver::class);
        FeePolicie::observe(FeePolicieObserver::class);
        ChargeOldStudent::observe(ChargeOldStudentObserver::class);

        /**
         * Paginate a standard Laravel Collection.
         *
         * @param int $perPage
         * @param int $page
         * @param int $total
         * @param string $pageName
         * @return array
         */
        Collection::macro('paginate', function ($perPage = null, $page = null, $total = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);

            return new LengthAwarePaginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );
        });

        Validator::extend('check_exists ', function ($attribute, $value, $parameters, $validator) {
            $data = DB::table($parameters[0])->where($parameters[1], $value)->first();

            if (is_null($data)) {
                return false;
            }

            return true;
        });

        Validator::extend('check_unique ', function ($attribute, $value, $parameters, $validator) {
            $data = DB::table($parameters[0])->where($parameters[1], $value)->first();

            if (!is_null($data)) {
                return false;
            }

            return true;
        });
    }
}
