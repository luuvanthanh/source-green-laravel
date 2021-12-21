<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class Conversation extends UuidModel
{

    protected $table = 'conversations';

    const NOTI_INBOX = [
        'NOT_SEEN' => 0,
        'SEEN' => 1
    ];

    const STATUS_SEND_MESSAGE = [
        'SEND' => 0,
        'RECEIVED' => 1,
        'READ' => 2
    ];

    protected $fillable = [
        'conversation_id_facebook', 'page_id', 'user_facebook_info_id', 'avatar', 'snippet', 'time', 'noti_inbox', 'status_send_message'
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function userFacebookInfo()
    {
        return $this->belongsTo(UserFacebookInfo::class);
    }

    public function message()
    {
        return $this->hasMany(Message::class);
    }
}
