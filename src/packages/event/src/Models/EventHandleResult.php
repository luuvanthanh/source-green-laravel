<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;

class EventHandleResult extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'event_handle_results';

    public $fillable = [
        'event_id', 'content',
    ];
}
