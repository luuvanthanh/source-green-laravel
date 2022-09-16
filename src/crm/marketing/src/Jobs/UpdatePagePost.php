<?php

namespace GGPHP\Crm\Marketing\Jobs;

use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Crm\Marketing\Repositories\Eloquent\ArticleRepositoryEloquent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdatePagePost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $retryAfter = 3600;
    public $timeout = 3610;
    public $tries = 1;

    protected $dataPage;
    protected $urls;
    protected $action;

    public function __construct($dataPage, $urls, $action)
    {
        $this->dataPage = $dataPage;
        $this->urls = $urls;
        $this->action = $action;
    }

    public function handle()
    {
        if ($this->action == 'video') {
            FacebookService::updatePagePostWithVideo($this->dataPage, $this->urls);
        } elseif ($this->action == 'image') {
            FacebookService::updatePagePostWithImage($this->dataPage, $this->urls);
        } else {
            FacebookService::updatePagePost($this->dataPage);
        }
    }
}
