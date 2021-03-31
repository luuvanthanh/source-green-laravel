<?php

namespace GGPHP\Core;

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
     * The namespace implementation.
     */
    protected static $namespace;

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
     * Register routes for all.
     *
     * @return void
     */
    public function all() {}

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
            'namespace' => static::$namespace
        ];

        $options = array_merge($defaultOptions, $options);

        \Route::group($options, function ($router) use ($callback) {
            $callback(new static($router));
        });
    }
}
