<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class EventHandleResult extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'event_handle_results';

    public $fillable = [
        'event_id', 'content', 'user_handle'
    ];

    public function userHandle()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'user_handle');
    }
}
