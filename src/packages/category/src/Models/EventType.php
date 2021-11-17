<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventType extends UuidModel
{
    use SoftDeletes;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'event_types';

    public $fillable = [
        'code', 'name', 'type',
    ];
}
