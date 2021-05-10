<?php

namespace GGPHP\MagneticCard;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\MagneticCard\Http\Controllers';

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
            //magnetic-cards
            \Route::get('magnetic-cards', [
                'comment' => 'Danh sách thẻ từ',
                'uses' => 'MagneticCardController@index',
                'as' => 'magnetic-cards.index',
            ]);

            \Route::post('magnetic-cards', [
                'comment' => 'Tạo mới thẻ từ',
                'uses' => 'MagneticCardController@store',
                'as' => 'magnetic-cards.store',
            ]);

            \Route::put('magnetic-cards/{id}', [
                'comment' => 'Chỉnh sửa thẻ từ',
                'uses' => 'MagneticCardController@update',
                'as' => 'magnetic-cards.update',
            ]);

            \Route::patch('magnetic-cards/{id}', [
                'comment' => 'Mở khoá chấm công thẻ từ',
                'uses' => 'MagneticCardController@restore',
                'as' => 'magnetic-cards.restore.update',
            ]);

            \Route::get('magnetic-cards/{id}', [
                'comment' => 'Thông tin thẻ từ',
                'uses' => 'MagneticCardController@show',
                'as' => 'magnetic-cards.show',
            ]);

            \Route::delete('magnetic-cards/{id}', [
                'comment' => 'Xóa, khoá thẻ từ',
                'uses' => 'MagneticCardController@destroy',
                'as' => 'magnetic-cards.destroy',
            ]);
        });
    }
}
