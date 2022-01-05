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
    protected $fillable = ['camera_id', 'systemConfig_destination_id', 'object_id', 'time', 'track_id'];
}
