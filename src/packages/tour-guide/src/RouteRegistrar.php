<?php

namespace GGPHP\TourGuide;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\TourGuide\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forAi();
        $this->forShare();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('tour-guides', 'TourGuideController');

            \Route::get('export-excel-tour-guides', 'TourGuideController@exportExcel');

            \Route::get('tour-guide-export-count-events', 'TourGuideController@exportExcelWithCountEvent');

            \Route::get('tour-guides-export-word/{id}', 'TourGuideController@exportWord');

            \Route::get('tour-guides-by-image', 'TourGuideController@tourGuidesByImage');

            \Route::get('export-tour-guides-by-image', 'TourGuideController@exportExcelTourGuidesByImage');
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('objects', 'TourGuideController@index');
        });
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forShare()
    {
        $this->router->group(['middleware' => []], function ($router) {
            \Route::get('tour-guides', 'TourGuideController@index')->name('tour-guides-share');
            \Route::get('tour-guides-identification', 'TourGuideController@index')->name('tour-guides-identification-share');
        });
    }
}
