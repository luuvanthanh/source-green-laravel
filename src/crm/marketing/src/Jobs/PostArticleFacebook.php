<?php

namespace GGPHP\Crm\Marketing\Jobs;

use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PostArticleFacebook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $retryAfter = 3600;
    public $timeout = 3610;
    public $tries = 1;

    protected $attributes;

    public function __construct($attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle()
    {
        ArticleRepositoryEloquent::postArticleFacebook($this->attributes);
    }
}
