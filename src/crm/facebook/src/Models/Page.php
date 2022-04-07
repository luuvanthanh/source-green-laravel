<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;

class Page extends UuidModel
{
    protected $table = 'pages';

    const IMAGE = [
        'jpg' => 'jpg',
        'png' => 'png',
        'jpeg' => 'jpeg',
        'jpe' => 'jpe',
    ];

    protected $fillable = [
        'page_id_facebook', 'name',
    ];

    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }

    public function postFacebookInfo()
    {
        return $this->hasMany(PostFacebookInfo::class);
    }
}
