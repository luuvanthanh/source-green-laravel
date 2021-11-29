<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class Page extends UuidModel
{

    protected $table = 'pages';

    protected $fillable = [
        'page_id_facebook', 'name',
    ];

    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }
}
