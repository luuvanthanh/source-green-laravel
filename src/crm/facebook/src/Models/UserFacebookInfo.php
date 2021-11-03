<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class UserFacebookInfo extends UuidModel
{

    protected $table = 'user_facebook_infos';

    protected $fillable = [
        'user_id','user_name','user_email','user_phone','user_birth_date','user_address'
    ];
}
