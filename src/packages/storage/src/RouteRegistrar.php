<?php

namespace GGPHP\Storage;

use Illuminate\Contracts\Routing\Registrar as Router;

class RouteRegistrar
{
    /**
     * The router implementation.
     *
     * @var \Illuminate\Contracts\Routing\Registrar
     */
    protected $router;

    /**
     * Create a new route registrar instance.
     *
     * @param  \Illuminate\Contracts\Routing\Registrar  $router
     * @return void
     */
    public function __construct(Router $router)
    {
        $this->router = $router;
    }

    /**
     * Register routes for bread.
     *
     * @return void
     */
    public function all()
    {
        $this->forUpload();
    }

    /**
     * Register the routes needed for managing clients.
     *
     * @return void
     */
    public function forUpload()
    {
        $this->router->group(['middleware' => []], function ($router) {
            $router->post('/upload', [
                'uses' => 'UploadController@upload',
                'as' => 'storage.manage.upload',
            ]);

            $router->delete('/storage', [
                'uses' => 'UploadController@delete',
                'as' => 'storage.manage.destroy',
            ]);
        });
    }

    /**
     * Binds the routes into the controller.
     *
     * @param  callable|null  $callback
     * @param  array  $options
     * @return void
     */
    public static function routes($callback = null, array $options = [])
    {
        $callback = $callback ?: function ($router) {
            $router->all();
        };

        $defaultOptions = [
            'namespace' => '\GGPHP\Storage\Http\Controllers',
        ];

        $options = array_merge($defaultOptions, $options);

        \Route::group($options, function ($router) use ($callback) {
            $callback(new RouteRegistrar($router));
        });
    }
}