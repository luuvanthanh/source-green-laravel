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
            \Route::get('tour-guides', [
                'comment' => 'Danh sách đối tượng',
                'uses' => 'TourGuideController@index',
                'as' => 'VIEW_LEGALTOURGUIDE|VIEW_ILLEGALTOURGUIDE|VIEW_BLACKLIST',
                'group' => 'Quản lý dữ liệu các đối tượng',
            ])->middleware('permission_for_role:VIEW_LEGALTOURGUIDE|VIEW_ILLEGALTOURGUIDE|VIEW_BLACKLIST');

            \Route::post('tour-guides', [
                'comment' => 'Thêm mới đối tượng cần theo dõi',
                'uses' => 'TourGuideController@store',
                'as' => 'ADD_BLACKLIST',
                'group' => 'Quản lý dữ liệu các đối tượng',
            ])->middleware('permission_for_role:ADD_CAMERA');

            \Route::put('tour-guides/{id}', [
                'comment' => 'Sửa thông tin đối tượng',
                'uses' => 'TourGuideController@update',
                'as' => 'EDIT_LEGALTOURGUIDE|EDIT_ILLEGALTOURGUIDE|EDIT_BLACKLIST',
                'group' => 'Quản lý dữ liệu các đối tượng',
            ])->middleware('permission_for_role:EDIT_LEGALTOURGUIDE|EDIT_ILLEGALTOURGUIDE|EDIT_BLACKLIST');

            \Route::get('tour-guides/{id}', [
                'comment' => 'Thông tin đối tượng',
                'uses' => 'TourGuideController@update',
                'as' => 'DETAIL_CAMERA',
                'group' => 'Quản lý dữ liệu các đối tượng',
            ])->middleware('permission_for_role:DETAIL_CAMERA');

            \Route::delete('tour-guides/{id}', [
                'comment' => 'Xóa đối tượng',
                'uses' => 'TourGuideController@destroy',
                'as' => 'DELETE_CAMERA',
                'group' => 'Quản lý dữ liệu các đối tượng',
            ])->middleware('permission_for_role:DELETE_CAMERA');

            \Route::get('export-excel-tour-guides', 'TourGuideController@exportExcel');

            \Route::get('tour-guide-export-count-events', 'TourGuideController@exportExcelWithCountEvent');

            \Route::get('tour-guides-export-word/{id}', 'TourGuideController@exportWord');

            \Route::get('tour-guides-by-image', [
                'comment' => 'Tìm kiếm đối tượng theo khuôn mặt',
                'uses' => 'TourGuideController@tourGuidesByImage',
                'as' => 'SEARCH_FACE',
                'group' => 'Quản lý và giám sát đối tượng',
            ])->middleware('permission_for_role:SEARCH_FACE');

            \Route::get('export-tour-guides-by-image', 'TourGuideController@exportExcelTourGuidesByImage');

            \Route::get('sync-tour-guides', [
                'comment' => 'Đồng bộ dữ liệu hướng dẫn viên',
                'uses' => 'TourGuideController@syncTourGuide',
                'as' => 'VIEW_SYNC',
                'group' => 'Đồng bộ dữ liệu',
            ])->middleware('permission_for_role:VIEW_SYNC');

            \Route::get('sync-tour-guides-image', 'TourGuideController@syncTourGuideImage');
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
            \Route::get('count-objects', 'TourGuideController@countObjects');
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
