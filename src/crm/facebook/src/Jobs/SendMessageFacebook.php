<?php

namespace GGPHP\Crm\Facebook\Jobs;

use GGPHP\Crm\Facebook\Services\FacebookService;
use GGPHP\Fee\Services\ClassTypeCrmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessageFacebook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $attributes;

    public function __construct($attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle()
    {
        FacebookService::pageConversationSendMessage($this->attributes);
    }
}
