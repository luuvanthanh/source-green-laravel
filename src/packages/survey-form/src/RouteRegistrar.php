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
        // SurveyForm
        \Route::resource('survey-forms', 'SurveyFormController');

        \Route::get('survey-form-result-summary/{id}', 'SurveyFormController@summaryResultSurvey');

        // Create video wall from surveyForm
        \Route::resource('survey-form-results', 'SurveyFormResultController')->only('destroy', 'update', 'show', 'index');

        \Route::resource('handle-works', 'HandleWorkController');
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
