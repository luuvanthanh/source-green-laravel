<?php

namespace GGPHP\Crm\Facebook\Jobs;

use GGPHP\Crm\Facebook\Repositories\Eloquent\ConversationRepositoryEloquent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class StoreDataToDatabase implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $retryAfter = 3600;
    public $timeout = 3610;

    protected $dataUserFacebookInfo;
    protected $dataPage;
    protected $userFacebookInfo;
    protected $conversationId;


    public function __construct($dataUserFacebookInfo, $dataPage, $userFacebookInfo, $conversationId)
    {
        $this->dataUserFacebookInfo = $dataUserFacebookInfo;
        $this->dataPage = $dataPage;
        $this->userFacebookInfo = $userFacebookInfo;
        $this->conversationId = $conversationId;
    }

    public function handle()
    {
        ConversationRepositoryEloquent::storeDataToDatabase($this->dataUserFacebookInfo, $this->dataPage, $this->userFacebookInfo, $this->conversationId);
    }
}
