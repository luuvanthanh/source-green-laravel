<?php

namespace GGPHP\ConfigReceiveNotification\Models;

use GGPHP\Category\Models\EventType;
use GGPHP\Core\Models\UuidModel;

class ConfigReceiveNotification extends UuidModel
{

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'config_receive_notifications';

    public $fillable = [
        'user_id', 'event_type_id', 'is_use'
    ];

    public function eventType()
    {
        return $this->belongsTo(EventType::class);
    }
}
