<?php

namespace GGPHP\Tourist;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Tourist\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        \Route::get('tourists', [
            'comment' => 'Tra cứu du khách tại khu điểm',
            'uses' => 'TouristController@index',
            'as' => 'SEARCH_TOURIST',
            'group' => 'Quản lý và giám sát đối tượng',
        ])->middleware('permission_for_role:SEARCH_TOURIST');

        // Tourist
        \Route::resource('tourists', 'TouristController')->except(['index']);

        \Route::get('export-tourists', 'TouristController@exportExcelTourists');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forAi()
    {
        // Tourist
        \Route::resource('tourists', 'TouristController')->only('store');
    }
}
