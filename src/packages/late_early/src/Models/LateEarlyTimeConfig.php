<?php

namespace GGPHP\LateEarly\Models;

use Carbon\Carbon;
use GGPHP\Core\Models\CoreModel;

class LateEarlyTimeConfig extends CoreModel
{

    /**
     * Define const late, early
     */
    const LATE = 'LATE';
    const EARLY = 'EARLY';

    protected $fillable = ['from_time', 'to_time', 'description', 'type', 'created_at', 'updated_at', 'type'];
}
