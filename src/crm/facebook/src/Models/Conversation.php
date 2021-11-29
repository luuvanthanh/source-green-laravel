<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class Conversation extends UuidModel
{

    protected $table = 'conversations';
    
    protected $fillable = [
        'conversation_id_facebook', 'page_id', 'user_facebook_info_id', 'avatar', 'snippet', 'time'
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
