<?php

namespace GGPHP\Crm\Facebook\Providers;

use GGPHP\Crm\Facebook\Repositories\Contracts\ConversationRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use GGPHP\Crm\Facebook\Repositories\Eloquent\ConversationRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\MessageRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\PageRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class FacebookServiceProvider extends ServiceProvider
{
    /**
     * The subscriber classes to register.
     *
     * @var array
     */
    protected $subscribe = [
        FacebookSubscriber::class,
    ];

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        }
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(PageRepository::class, PageRepositoryEloquent::class);
        $this->app->bind(MessageRepository::class, MessageRepositoryEloquent::class);
        $this->app->bind(ConversationRepository::class, ConversationRepositoryEloquent::class);
    }
}
