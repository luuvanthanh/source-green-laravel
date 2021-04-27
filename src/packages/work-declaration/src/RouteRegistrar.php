<?php

namespace GGPHP\WorkDeclaration;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\WorkDeclaration\Http\Controllers';

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
            //work-declaration
            \Route::get('work-declarations', [
                'comment' => 'Danh sách khai báo công',
                'uses' => 'WorkDeclarationController@index',
                'as' => 'work-declarations.index',
                'group' => 'Khai báo công',
            ]);

            \Route::post('work-declarations', [
                'comment' => 'Tạo mới khai báo công',
                'uses' => 'WorkDeclarationController@store',
                'as' => 'work-declarations.store',
                'group' => 'Khai báo công',
            ]);

            \Route::get('work-declarations/{id}', [
                'comment' => 'Thông tin khai báo công',
                'uses' => 'WorkDeclarationController@show',
                'as' => 'work-declarations.show',
                'group' => 'Khai báo công',
            ]);

            \Route::put('work-declarations/{id}', [
                'comment' => 'Chỉnh sửa khai báo công',
                'uses' => 'WorkDeclarationController@update',
                'as' => 'work-declarations.update',
                'group' => 'Khai báo công',
            ]);

        });
    }
}
