<?php

namespace GGPHP\Crm\Facebook\Models;

use GGPHP\Core\Models\UuidModel;

class UserFacebookInfo extends UuidModel
{

    protected $table = 'user_facebook_infos';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    const STATUS = [
        'NOT_LEAD' => 0,
        'LEAD' => 1
    ];

    protected $fillable = [
        'user_id', 'user_name', 'user_email', 'user_phone', 'user_birth_date', 'user_address', 'status', 'customer_lead_id', 'user_full_name', 'note', 'avatar', 'sex', 'employee_facebook_id'
    ];

    public function conversation()
    {
        return $this->hasMany(Conversation::class);
    }

    public function userFacebookInfoTag()
    {
        return $this->hasMany(UserFacebookInfoTag::class);
    }

    public function employeeFacebook()
    {
        return $this->belongsTo(EmployeeFacebook::class);
    }
}
