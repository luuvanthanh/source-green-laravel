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
            \Route::resource('evaluation-criterias', 'EvaluationCriteriaController');
            \Route::resource('interviewers', 'InterviewerController');
            \Route::resource('point-evaluations', 'PointEvaluationController');
            \Route::resource('interview-configurations', 'InterviewConfigurationController');
            \Route::resource('interview-lists', 'InterviewListController');
            \Route::put('sendSuggestions/{id}', 'InterviewListController@sendSuggestions');
            \Route::put('complete-interview/{id}', 'InterviewListController@completeInterview');
        });
    }
}
