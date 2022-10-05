<?php

namespace GGPHP\TeacherTimekeeping;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\TeacherTimekeeping\Http\Controllers';

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
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('teacher-timekeepings', 'TeacherTimekeepingController');

            \Route::post('store-teacher-timekeepings', 'TeacherTimekeepingController@storeTeacherTimekeeping');
        });
    }
}
