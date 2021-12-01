<?php

namespace GGPHP\Crm\Category;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Category\Http\Controllers';

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
            \Route::resource('status-parent-potentials', 'StatusParentPotentialController');
            \Route::resource('status-parent-leads', 'StatusParentLeadController');
            \Route::resource('tags', 'TagController');
            \Route::resource('search-sources', 'SearchSourceController');
            \Route::resource('status-admission-registers', 'StatusAdmissionRegisterController');
            \Route::resource('branches', 'BranchController');
            \Route::resource('category-events', 'CategoryEventController');
            \Route::resource('category-relationships', 'CategoryRelationshipController');
            \Route::resource('category-skills', 'CategorySkillController');
            \Route::resource('category-child-issues', 'CategoryChildIssueController');
            \Route::post('category-skill-sorts', 'CategorySkillController@sort');
        });
    }
}
