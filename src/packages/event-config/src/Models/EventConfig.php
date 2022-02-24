<?php

namespace  GGPHP\EventConfig\Models;

use GGPHP\Core\Models\UuidModel;

class EventConfig extends UuidModel
{
    protected $table = 'event_configs';

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
