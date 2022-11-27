<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigHourStatusShowEvent extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'config_hour_status_show_events';

    public $fillable = [
        'hour',
    ];
}
