<?php

namespace GGPHP\InterviewManager;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\InterviewManager\Http\Controllers';

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
            \Route::resource('evaluation-criterias-interview', 'EvaluationCriteriaController');
            \Route::resource('interviewers', 'InterviewerController');
            \Route::resource('point-evaluations', 'PointEvaluationController');
            \Route::resource('interview-configurations', 'InterviewConfigurationController');
            \Route::resource('interview-lists', 'InterviewListController');
            // gửi đề xuất đã phỏng vấn
            \Route::put('sendSuggestions/{id}', 'InterviewListController@sendSuggestions');
            // gửi đê xuất không duyệt lương
            \Route::put('sendSuggestion-do-not-approve/{id}', 'InterviewListController@sendSuggestionDoNotApprove');
            \Route::put('complete-interview/{id}', 'DoInterviewController@completeInterview');
            // duyệt lương bởi CEO
            \Route::put('salary-approval/{id}', 'InterviewListController@salaryApproval');
            
            // get cấu hình và người phụ trách dựa vào bộ phận.
            \Route::get('get-configuation-employee/{id}', 'InterviewerController@getConfiguationEmployee');
            // get làm phỏng vấn
            \Route::resource('do-interviews', 'DoInterviewController');
        });
    }
}
