<?php

namespace GGPHP\Category;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Category\Http\Controllers';

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
            \Route::get('tourist-destinations', [
                'comment' => 'Danh sách khu điểm',
                'uses' => 'TouristDestinationController@index',
                'as' => 'VIEW_SITE',
                'group' => 'Quản lý khu điểm du lịch',
            ])->middleware('permission_for_role:VIEW_SITE');

            \Route::post('tourist-destinations', [
                'comment' => 'Thêm mới khu điểm',
                'uses' => 'TouristDestinationController@store',
                'as' => 'ADD_SITE',
                'group' => 'Quản lý khu điểm du lịch',
            ])->middleware('permission_for_role:ADD_SITE');

            \Route::put('tourist-destinations/{id}', [
                'comment' => 'Sửa thông tin khu điểm',
                'uses' => 'TouristDestinationController@update',
                'as' => 'EDIT_SITE',
                'group' => 'Quản lý khu điểm du lịch',
            ])->middleware('permission_for_role:EDIT_SITE');

            \Route::get('tourist-destinations/{id}', [
                'comment' => 'Thông tin khu điểm',
                'uses' => 'TouristDestinationController@show',
                'as' => 'DETAIL_SITE',
                'group' => 'Quản lý khu điểm du lịch',
            ])->middleware('permission_for_role:DETAIL_SITE');

            \Route::delete('tourist-destinations/{id}', [
                'comment' => 'Xóa khu điểm',
                'uses' => 'TouristDestinationController@destroy',
                'as' => 'DELETE_SITE',
                'group' => 'Quản lý khu điểm du lịch',
            ])->middleware('permission_for_role:DELETE_SITE');

            \Route::get('event-types', [
                'comment' => 'Danh sách loại sự kiện',
                'uses' => 'EventTypeController@index',
                'as' => 'VIEW_EVENTTYPE',
                'group' => 'Quản lý loại sự kiện',
            ])->middleware('permission_for_role:VIEW_EVENTTYPE');

            \Route::get('provinces', [
                'comment' => 'Danh sách tỉnh cấp thẻ',
                'uses' => 'ProvinceController@index',
                'as' => 'VIEW_PROVINCE',
                'group' => 'Quản lý tỉnh cấp thẻ',
            ])->middleware('permission_for_role:VIEW_PROVINCE');

            \Route::get('card-types', [
                'comment' => 'Danh sách loại thẻ',
                'uses' => 'CardTypeController@index',
                'as' => 'VIEW_CARDTYPE',
                'group' => 'Quản lý loại thẻ',
            ])->middleware('permission_for_role:VIEW_CARDTYPE');

            \Route::get('languages', [
                'comment' => 'Danh sách ngoại ngữ sử dụng',
                'uses' => 'LanguageController@index',
                'as' => 'VIEW_LANGUAGE  ',
                'group' => 'Quản lý ngoại ngữ sử dụng',
            ])->middleware('permission_for_role:VIEW_LANGUAGE');

            \Route::post('import-provinces', 'ProvinceController@importProvince');
            \Route::resource('object-types', 'ObjectTypeController');
            \Route::resource('units', 'UnitController');

            \Route::get('units', [
                'comment' => 'Danh sách đơn vị',
                'uses' => 'UnitController@index',
                'as' => 'VIEW_UNIT',
                'group' => 'Quản lý đơn vị',
            ])->middleware('permission_for_role:VIEW_UNIT');

            \Route::post('units', [
                'comment' => 'Thêm mới đơn vị',
                'uses' => 'UnitController@store',
                'as' => 'ADD_UNIT',
                'group' => 'Quản lý đơn vị',
            ])->middleware('permission_for_role:ADD_UNIT');

            \Route::put('units/{id}', [
                'comment' => 'Sửa thông tin đơn vị',
                'uses' => 'UnitController@update',
                'as' => 'EDIT_UNIT',
                'group' => 'Quản lý đơn vị',
            ])->middleware('permission_for_role:EDIT_UNIT');

            \Route::get('units/{id}', [
                'comment' => 'Thông tin đơn vị',
                'uses' => 'UnitController@show',
                'as' => 'DETAIL_UNIT',
                'group' => 'Quản lý đơn vị',
            ])->middleware('permission_for_role:DETAIL_UNIT');

            \Route::delete('units/{id}', [
                'comment' => 'Xóa đơn vị',
                'uses' => 'UnitController@destroy',
                'as' => 'DELETE_UNIT',
                'group' => 'Quản lý đơn vị',
            ])->middleware('permission_for_role:DELETE_UNIT');
        });
    }
}
