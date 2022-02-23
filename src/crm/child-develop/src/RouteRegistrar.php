<?php

namespace GGPHP\Crm\ChildDevelop;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\ChildDevelop\Http\Controllers';

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
            \Route::resource('category-skills', 'CategorySkillController');
            \Route::post('category-skill-sorts', 'CategorySkillController@sort');
            \Route::resource('category-child-issues', 'CategoryChildIssueController');
            \Route::resource('category-question-parents', 'CategoryQuestionParentController');
            \Route::resource('child-evaluates', 'ChildEvaluateController');
            \Route::put('child-evaluate-update-uses/{id}', 'ChildEvaluateController@updateUse');
            \Route::put('update-status-category-skills/{id}', 'CategorySkillController@updateStatus');
        });
    }
}
