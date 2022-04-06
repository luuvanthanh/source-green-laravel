<?php

namespace GGPHP\Bio;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Bio\Http\Controllers';

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
            //bios
            \Route::get('bios', [
                'comment' => 'Danh sách gương mặt',
                'uses' => 'BioController@index',
                'as' => 'bios.index',
            ]);

            \Route::get('bios/{id}', [
                'comment' => 'Thông tin gương mặt',
                'uses' => 'BioController@show',
                'as' => 'bios.show',
            ]);
        });
    }
}
