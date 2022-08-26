<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class Message extends UuidModel
{
    protected $table = 'messages';

    const STATUS_SEND_MESSAGE = [
        'SEND' => 0,
        'RECEIVED' => 1,
        'READ' => 2
    ];
    protected $fillable = [
        'content', 'message_id_facebook', 'from', 'to', 'conversation_id', 'status_send_message', 'watermark', 'created_at', 'updated_at'
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
