<?php

namespace GGPHP\Crm\Facebook\Jobs;

use GGPHP\Crm\Facebook\Repositories\Eloquent\ConversationRepositoryEloquent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ConversationNotError implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $retryAfter = 3600;
    public $timeout = 3610;

    protected $value;
    protected $conversationId;
    protected $attributes;

    public function __construct($value, $conversationId, $attributes)
    {
        $this->value = $value;
        $this->conversationId = $conversationId;
        $this->attributes = $attributes;
    }

    public function handle()
    {
        try {
            ConversationRepositoryEloquent::conversationNotError($this->value, $this->conversationId, $this->attributes);
        } catch (\Throwable $th) {
            dispatch(new ConversationGetAvatarUserError($this->value, $this->conversationId));
        }
    }
}
