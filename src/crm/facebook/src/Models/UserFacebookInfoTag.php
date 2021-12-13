<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Tag;

class UserFacebookInfoTag extends UuidModel
{

    protected $table = 'user_facebook_info_tag';

    protected $fillable = [
        'user_facebook_info_id', 'tag_id'
    ];

    public function userFacebookInfo()
    {
        return $this->belongsTo(UserFacebookInfo::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
