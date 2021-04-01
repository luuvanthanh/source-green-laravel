<?php

namespace GGPHP\Users\Providers;

use Config;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as AuthServiceProvider;

class UserServiceProvider extends AuthServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/config.php', 'constants'
        );
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'ggphp-users');
        $this->loadTranslationsFrom(__DIR__ . '/../../resources/lang', 'lang');
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }

        $this->registerPolicies();

        // set auth config system
        $setDriver = Config::set('auth.guards.api.driver', 'passport');
        $setProviders = Config::set('auth.providers.users.model', User::class);
        $setConfigRepository = Config::set('repository.fractal.serializer', 'League\Fractal\Serializer\JsonApiSerializer');

    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(UserRepository::class, UserRepositoryEloquent::class);
    }
}
