<?php

namespace GGPHP\Crm\Marketing\Jobs;

use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishPagePost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $retryAfter = 3600;
    public $timeout = 3610;

    protected $value;
    protected $urls;
    protected $action;
    protected $article;
    protected $pageId;

    public function __construct($value, $urls, $action, $article, $pageId)
    {
        $this->value = $value;
        $this->urls = $urls;
        $this->action = $action;
        $this->article = $article;
        $this->pageId = $pageId;
    }

    public function handle()
    {
        if ($this->action == 'video') {
            $response = FacebookService::publishPagePostWithVideo($this->value, $this->urls);
            ArticleRepositoryEloquent::storePostFacebookInfo($this->article, $this->action, $this->pageId, $response);
        } elseif ($this->action == 'image') {
            $response = FacebookService::publishPagePostWithImage($this->value, $this->urls);
            ArticleRepositoryEloquent::storePostFacebookInfo($this->article, $this->action, $this->pageId, $response);
        } else {
            $response = FacebookService::publishPagePost($this->value);
            ArticleRepositoryEloquent::storePostFacebookInfo($this->article, $this->action, $this->pageId, $response);
        }
    }
}
