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
            $router->post('/upload', [
                'uses' => 'UploadController@upload',
                'as' => 'storage.manage.upload',
            ]);

            $router->get('/download', [
                'uses' => 'UploadController@download',
                'as' => 'storage.manage.download',
            ]);

            $router->delete('/storage', [
                'uses' => 'UploadController@delete',
                'as' => 'storage.manage.destroy',
            ]);

            $router->delete('/media-delete', [
                'uses' => 'UploadController@deleteMedia',
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
