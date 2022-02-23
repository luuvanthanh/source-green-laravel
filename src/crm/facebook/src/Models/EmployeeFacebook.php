<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class EmployeeFacebook extends UuidModel
{

    protected $table = 'employee_facebooks';

    protected $fillable = [
        'employee_fb_name', 'employee_fb_id', 'page_id', 'avatar'
    ];

    public function userFacebookInfo()
    {
        return $this->hasMany(UserFacebookInfo::class);
    }
}
