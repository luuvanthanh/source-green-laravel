<?php

namespace GGPHP\AiService;

use GGPHP\Core\RouteRegistrar as CoreRegistrar;

class RouteRegistrar extends CoreRegistrar
{
    /**
     * The namespace implementation.
     */
    protected static $namespace = '\GGPHP\AiService\Http\Controllers';

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
        // AiService
        \Route::resource('ai-services', 'AiServiceController');

        \Route::get('check-ai-services', 'AiServiceController@checkAiService');
    }
}
