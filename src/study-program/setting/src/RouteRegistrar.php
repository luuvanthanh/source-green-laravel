<?php

namespace GGPHP\StudyProgram\Setting;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\StudyProgram\Setting\Http\Controllers';

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
            \Route::resource('subjects', 'SubjectController');
            \Route::resource('evaluation-criterias', 'EvaluationCriteriaController');
<<<<<<< HEAD
=======
            \Route::resource('sample-comments', 'SampleCommentController');
>>>>>>> f26c4c9ce7dd9a40420dc2f9b4ac187684f9ea2b
        });
    }
}
