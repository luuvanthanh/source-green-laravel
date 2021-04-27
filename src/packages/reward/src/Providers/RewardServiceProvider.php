<?php

namespace GGPHP\Reward\Providers;

use GGPHP\Reward\Models\Reward;
use GGPHP\Reward\Repositories\Contracts\DecisionRewardRepository;
use GGPHP\Reward\Repositories\Contracts\RewardRepository;
use GGPHP\Reward\Repositories\Eloquent\DecisionRewardRepositoryEloquent;
use GGPHP\Reward\Repositories\Eloquent\RewardRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class RewardServiceProvider extends ServiceProvider
{
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
        $this->app->bind(RewardRepository::class, RewardRepositoryEloquent::class);
        $this->app->bind(DecisionRewardRepository::class, DecisionRewardRepositoryEloquent::class);
    }
}
