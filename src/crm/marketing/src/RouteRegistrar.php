<?php

namespace GGPHP\Crm\Marketing;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\Crm\Marketing\Http\Controllers';

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
            \Route::resource('data-marketings', 'DataMarketingController');
            \Route::post('program-data-marketings', 'DataMarketingController@storeProgram');
            \Route::post('delete-program-data-marketings', 'DataMarketingController@deleteProgram');
            \Route::resource('marketing-programs', 'MarketingProgramController');
            \Route::resource('data-marketing-student-infos', 'DataMarketingStudentInfoController');
            \Route::resource('articles', 'ArticleController');
            \Route::post('move-leads', 'DataMarketingController@moveLead');
            \Route::post('post-article-facebooks', 'ArticleController@postArticleFacebook');
            \Route::post('data-marketing-tags', 'DataMarketingController@createTag');
            \Route::post('merge-data-marketings', 'DataMarketingController@mergeDataMarketing');
        });
    }
}
