<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;

class EventHandle extends UuidModel
{

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'event_handles';

    public $fillable = [
        'event_id', 'user_edit', 'user_handle', 'note'
    ];
}
