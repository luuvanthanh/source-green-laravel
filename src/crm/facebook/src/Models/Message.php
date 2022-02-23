<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class Message extends UuidModel
{

    protected $table = 'messages';

    protected $fillable = [
        'content', 'message_id_facebook', 'from', 'to', 'conversation_id'
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }
}
