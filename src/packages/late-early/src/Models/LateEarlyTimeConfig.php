<?php

namespace GGPHP\LateEarly\Models;

use GGPHP\Core\Models\UuidModel;

class LateEarlyTimeConfig extends UuidModel
{
    public $incrementing = false;

    /**
     * Define const late, early
     */
    const LATE = 'LATE';
    const EARLY = 'EARLY';

    protected $fillable = ['from_time', 'to_time', 'description', 'type', 'created_at', 'updated_at', 'type'];
}
