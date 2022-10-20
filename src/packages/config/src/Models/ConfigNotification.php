<?php

namespace GGPHP\Config\Models;

use GGPHP\Core\Models\UuidModel;

class ConfigNotification extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ConfigNotifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Date', 'Hour', 'Type',
    ];

    const TYPE = [
        'WORK_HOUR' => 1,
        'BUSINESS_CARD' => 2,
        'BIRTHDAY' => 3
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
