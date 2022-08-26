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

    const FOLDER = ['page_done', 'inbox', 'other', 'spam'];

    const FIELD = ',unread_count,senders{profile_pic},can_reply,snippet,updated_time,wallpaper';

    protected $fillable = [
        'conversation_id_facebook', 'page_id', 'user_facebook_info_id', 'avatar', 'snippet', 'time', 'noti_inbox', 'status_send_message', 'from', 'to', 'show_conversation'
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
