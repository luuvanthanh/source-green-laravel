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

        // Create video wall from surveyForm
        \Route::resource('survey-form-results', 'SurveyFormResultController');
    }
}
