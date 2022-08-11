<?php

namespace  GGPHP\SystemConfig\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class SystemConfig extends UuidModel
{
    protected $table = 'system_configs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['language', 'account_send_email'];


    protected $casts = [];

    public function receiveEmail()
    {
        return $this->belongsToMany(User::class, 'system_config_receive_email', 'system_config_id', 'user_id');
    }

    public function teamplateEmail()
    {
        return $this->hasMany(TeamplateEmail::class);
    }
}
