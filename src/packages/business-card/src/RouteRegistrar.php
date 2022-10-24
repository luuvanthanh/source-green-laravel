<?php

namespace GGPHP\BusinessCard;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\BusinessCard\Http\Controllers';

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
            //business-cards
            \Route::get('business-cards', [
                'comment' => 'Danh sách công bù giờ',
                'uses' => 'BusinessCardController@index',
                'as' => 'business-cards.index',
                'group' => 'Công bù giờ',
            ]);

            \Route::post('business-cards', [
                'comment' => 'Tạo mới công bù giờ',
                'uses' => 'BusinessCardController@store',
                'as' => 'business-cards.store',
                'group' => 'Công bù giờ',
            ]);

            \Route::put('business-cards/{id}', [
                'comment' => 'Chỉnh sửa công bù giờ',
                'uses' => 'BusinessCardController@update',
                'as' => 'business-cards.update',
                'group' => 'Công bù giờ',
            ]);

            \Route::get('business-cards/{id}', [
                'comment' => 'Thông tin công bù giờ',
                'uses' => 'BusinessCardController@show',
                'as' => 'business-cards.show',
                'group' => 'Công bù giờ',
            ]);

            \Route::delete('business-cards/{id}', [
                'comment' => 'Xóa công bù giờ',
                'uses' => 'BusinessCardController@destroy',
                'as' => 'business-cards.destroy',
                'group' => 'Công bù giờ',
            ]);
        });
    }
}
