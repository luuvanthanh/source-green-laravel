<?php

namespace GGPHP\Crm\Facebook\Providers;

use GGPHP\Crm\Facebook\Repositories\Contracts\ConversationRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\EmployeeFacebookRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\PageRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoRepository;
use GGPHP\Crm\Facebook\Repositories\Contracts\UserFacebookInfoTagRepository;
use GGPHP\Crm\Facebook\Repositories\Eloquent\ConversationRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\EmployeeFacebookRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\MessageRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\PageRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\UserFacebookInfoRepositoryEloquent;
use GGPHP\Crm\Facebook\Repositories\Eloquent\UserFacebookInfoTagRepositoryEloquent;
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
        $this->app->bind(UserFacebookInfoRepository::class, UserFacebookInfoRepositoryEloquent::class);
        $this->app->bind(UserFacebookInfoTagRepository::class, UserFacebookInfoTagRepositoryEloquent::class);
        $this->app->bind(EmployeeFacebookRepository::class, EmployeeFacebookRepositoryEloquent::class);
    }
}
