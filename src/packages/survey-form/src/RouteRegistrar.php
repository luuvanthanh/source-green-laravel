<?php

namespace GGPHP\SurveyForm;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{

    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\SurveyForm\Http\Controllers';

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forBread();
        $this->forGuest();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forBread()
    {
        \Route::get('survey-forms', [
            'comment' => 'Danh sách và chi tiết khảo sát',
            'uses' => 'SurveyFormController@index',
            'as' => 'VIEW_SURVEYRESULT|VIEW_SURVEY',
            'group' => 'Quản lý và giám sát đối tượng',
        ])->middleware('permission_for_role:VIEW_SURVEYRESULT|VIEW_SURVEY');

        \Route::post('survey-forms', [
            'comment' => 'Thêm mới phiếu khảo sát',
            'uses' => 'SurveyFormController@store',
            'as' => 'ADD_SURVEY',
            'group' => 'Quản lý phiếu khảo sát',
        ])->middleware('permission_for_role:ADD_SURVEY');

        \Route::put('survey-forms/{id}', [
            'comment' => 'Sửa thông tin phiếu khảo sát',
            'uses' => 'SurveyFormController@update',
            'as' => 'EDIT_SURVEY',
            'group' => 'Quản lý phiếu khảo sát',
        ])->middleware('permission_for_role:EDIT_SURVEY');

        \Route::get('survey-forms/{id}', [
            'comment' => 'Thông tin phiếu khảo sát',
            'uses' => 'SurveyFormController@show',
            'as' => 'DETAIL_SURVEY',
            'group' => 'Quản lý phiếu khảo sát',
        ])->middleware('permission_for_role:DETAIL_SURVEY');

        \Route::delete('survey-forms/{id}', [
            'comment' => 'Xóa phiếu khảo sát',
            'uses' => 'SurveyFormController@destroy',
            'as' => 'DELETE_SURVEY',
            'group' => 'Quản lý phiếu khảo sát',
        ])->middleware('permission_for_role:DELETE_SURVEY');

        \Route::get('survey-form-result-summary/{id}', 'SurveyFormController@summaryResultSurvey');

        \Route::resource('survey-form-results', 'SurveyFormResultController')->only('destroy', 'update', 'show', 'index');

        \Route::resource('handle-works', 'HandleWorkController');

        \Route::get('survey-form-export', 'SurveyFormController@surveyFormExport');
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forGuest()
    {
        // SurveyForm
        \Route::get('survey-form-by-slug/{slug}', 'SurveyFormController@getSurveyFormBySlug');

        \Route::resource('survey-form-results', 'SurveyFormResultController')->only('store');
    }
}
