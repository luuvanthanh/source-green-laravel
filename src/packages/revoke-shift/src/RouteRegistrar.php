<?php

namespace GGPHP\RevokeShift;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\RevokeShift\Http\Controllers';

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
            \Route::group(['middleware' => []], function () {
                //revoke shift
                \Route::get('revoke-shifts', [
                    'comment' => 'Danh sách bỏ ca',
                    'uses' => 'RevokeShiftController@index',
                    'as' => 'revoke-shifts.index',
                    'group' => 'Bỏ ca',
                ]);

                \Route::get('load-revoke-shifts', [
                    'uses' => 'RevokeShiftController@loadRevokeShift',
                    'as' => 'revoke-shifts.loadRevokeShift',
                ]);

                \Route::get('revoke-shifts/{id}', [
                    'comment' => 'Thông tin bỏ ca',
                    'uses' => 'RevokeShiftController@show',
                    'as' => 'revoke-shifts.show',
                    'group' => 'Bỏ ca',
                ]);
            });

        });
    }
}
