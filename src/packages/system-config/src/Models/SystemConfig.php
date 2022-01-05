<?php

namespace  GGPHP\SystemConfig\Models;

use GGPHP\Core\Models\UuidModel;

class SystemConfig extends UuidModel
{
    protected $table = 'system_configs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['config_event', 'config_count_tourist'];


    protected $casts = [
        'config_event'  =>  'array',
        'config_count_tourist'  =>  'array',
    ];
}
