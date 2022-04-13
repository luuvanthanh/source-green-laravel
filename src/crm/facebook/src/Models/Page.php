<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;

class Page extends UuidModel
{
    protected $table = 'pages';

    const IMAGE = [
        'JPG' => 'jpg',
        'PNG' => 'png',
        'JPEG' => 'jpeg',
        'JPE' => 'jpe',
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
