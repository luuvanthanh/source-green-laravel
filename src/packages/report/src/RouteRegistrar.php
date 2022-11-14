<?php

namespace GGPHP\Report;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Report\Http\Controllers';

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
            \Route::get('report-general', [
                'comment' => 'Báo cáo thống kê chung',
                'uses' => 'ReportController@generalReport',
                'as' => 'VIEW_STATISTICSDASHBOARD',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSDASHBOARD');

            \Route::get('report-number-event-object', [
                'comment' => 'Số lượng HDV hợp pháp',
                'uses' => 'ReportController@numberEventReportObject',
                'as' => 'VIEW_STATISTICSLEGALTOURGUIDE|VIEW_STATISTICSILLEGALTOURGUIDE',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSLEGALTOURGUIDE|VIEW_STATISTICSILLEGALTOURGUIDE');

            \Route::get('report-frequency-of-appearance', [
                'comment' => 'Tần suất xuất hiện của HDV hợp pháp',
                'uses' => 'ReportController@frequencyOfAppearanceReport',
                'as' => 'VIEW_STATISTICSLEGALRATE|VIEW_STATISTICSILLEGALRATE|VIEW_STATISTICSBLACKLISTRATE',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSLEGALRATE|VIEW_STATISTICSILLEGALRATE|VIEW_STATISTICSBLACKLISTRATE');

            \Route::get('report-frequency-of-business', [
                'comment' => 'Tần suất hoạt động của các Doanh nghiệp lữ hành',
                'uses' => 'ReportController@frequencyOfBusinessReport',
                'as' => 'VIEW_STATISTICSAGENCYRATE',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSAGENCYRATE');

            \Route::get('report-number-event-behavior', [
                'comment' => 'Phát hiện bán hàng rong',
                'uses' => 'ReportController@numberEventReportBehavior',
                'as' => 'VIEW_STATISTICSHAWKER|VIEW_STATISTICSTRASH',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSHAWKER|VIEW_STATISTICSTRASH');

            \Route::get('report-warning', [
                'comment' => 'Cảnh báo',
                'uses' => 'ReportController@warningReport',
                'as' => 'VIEW_STATISTICSALERT',
                'group' => 'Báo cáo thống kê',
            ])->middleware('permission_for_role:VIEW_STATISTICSALERT');

            \Route::get('report-status-camera', [
                'comment' => 'Danh sách sự kiện thời gian thực & Bản đồ camera',
                'uses' => 'ReportController@cameraStatusReport',
                'as' => 'VIEW_DASHBOARD',
                'group' => 'Quản lý và giám sát đối tượng',
            ])->middleware('permission_for_role:VIEW_DASHBOARD');


            //export
            \Route::get('report-number-event-object-export', 'ReportController@numberEventReportObjectExport');
            \Route::get('report-number-event-behavior-export', 'ReportController@numberEventReportBehaviorExport');
            \Route::get('report-warning-export', 'ReportController@warningReportExport');
            \Route::get('report-event-flow-export', 'ReportController@eventFlowReportExport');
            \Route::get('report-event-flow', 'ReportController@eventFlowReport');
            \Route::get('report-event-flow-user', 'ReportController@eventFlowReportUser');
            \Route::get('report-event-flow-user-export', 'ReportController@eventFlowReportUserExport');
        });
    }
}
