<?php

namespace GGPHP\Transfer;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Transfer\Http\Controllers';

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
                //transfers
                \Route::get('transfers', [
                    'comment' => 'Danh sách điều chuyển',
                    'uses' => 'TransferController@index',
                    'as' => 'transfers.index',
                    'group' => 'Điều chuyển',
                ]);

                \Route::post('transfers', [
                    'comment' => 'Tạo mới điều chuyển',
                    'uses' => 'TransferController@store',
                    'as' => 'transfers.store',
                    'group' => 'Điều chuyển',
                ]);

                \Route::put('transfers/{id}', [
                    'comment' => 'Chỉnh sửa điều chuyển',
                    'uses' => 'TransferController@update',
                    'as' => 'transfers.update',
                    'group' => 'Điều chuyển',
                ]);

                \Route::get('transfers/{id}', [
                    'comment' => 'Thông tin điều chuyển',
                    'uses' => 'TransferController@show',
                    'as' => 'transfers.show',
                    'group' => 'Điều chuyển',
                ]);

                \Route::delete('transfers/{id}', [
                    'comment' => 'Xóa điều chuyển',
                    'uses' => 'TransferController@destroy',
                    'as' => 'transfers.destroy',
                    'group' => 'Điều chuyển',
                ]);

                \Route::get('transfers-export-word/{id}', [
                    'uses' => 'TransferController@exportWord',
                    'as' => 'transfers.word.export',
                ]);
            });

        });
    }
}
