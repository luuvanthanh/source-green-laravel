<?php

namespace App\Providers;

use CloudCreativity\LaravelJsonApi\LaravelJsonApi;
use GGPHP\Crm\Fee\Models\ClassType;
use GGPHP\Crm\Fee\Models\Fee;
use GGPHP\Crm\Fee\Models\PaymentForm;
use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Observers\ClassTypeObserver;
use GGPHP\Crm\Fee\Observers\FeeObserver;
use GGPHP\Crm\Fee\Observers\SchoolYearObserver;
use GGPHP\Crm\Fee\Observers\PaymentFormObserver;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;
use Twilio\Jwt\AccessToken;

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
        $this->app->bind(
            AccessToken::class,
            function ($app) {
                $accountSid = config('services.twilio')['accountSid'];
                $apiKey = config('services.twilio')['apiKey'];
                $apiSecret = config('services.twilio')['apiSecret'];

                return new AccessToken($accountSid, $apiKey, $apiSecret, 3600, 'identity');
            }
        );
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
        SchoolYear::observe(SchoolYearObserver::class);
        ClassType::observe(ClassTypeObserver::class);
        Fee::observe(FeeObserver::class);
        PaymentForm::observe(PaymentFormObserver::class);

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
    }
}
