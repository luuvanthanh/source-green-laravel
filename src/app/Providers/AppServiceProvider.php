<?php

namespace App\Providers;

use CloudCreativity\LaravelJsonApi\LaravelJsonApi;
use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Observers\SchoolYearObserver;
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

        SchoolYear::observe(SchoolYearObserver::class);
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
