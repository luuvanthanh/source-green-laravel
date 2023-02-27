<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\KnowledgeToTeachChildren\Http\Controllers';

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
        $this->router->group(['middleware' => []], function ($router) {
            \Route::resource('category-knowledge-to-teach-childrens', 'CategoryKnowledgeToTeachChildrenController')->only('index','store');
            \Route::put('category-knowledge-to-teach-childrens/{id}', 'CategoryKnowledgeToTeachChildrenController@update');
            \Route::delete('category-knowledge-to-teach-childrens/{id}', 'CategoryKnowledgeToTeachChildrenController@destroy');
            \Route::get('category-knowledge-to-teach-childrens/{id}', 'CategoryKnowledgeToTeachChildrenController@show');

            \Route::resource('post-knowledge-to-teach-childrens', 'PostKnowledgeToTeachChildrenController')->only('index','store');
            \Route::put('post-knowledge-to-teach-childrens/{id}', 'PostKnowledgeToTeachChildrenController@update');
            \Route::delete('post-knowledge-to-teach-childrens/{id}', 'PostKnowledgeToTeachChildrenController@destroy');
            \Route::get('post-knowledge-to-teach-childrens/{id}', 'PostKnowledgeToTeachChildrenController@show');

            \Route::get('get-bmi-children', 'PostKnowledgeToTeachChildrenController@getBmiChildren');
        });
    }

    public function forGuest()
    {
        $this->router->group(['middleware' => []], function ($router) {
            //
        });
    }
}
