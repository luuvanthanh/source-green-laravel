<?php

namespace App\Providers;

use CloudCreativity\LaravelJsonApi\LaravelJsonApi;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Observers\ClassTypeObserver;
use GGPHP\Fee\Observers\FeeObserver;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
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
