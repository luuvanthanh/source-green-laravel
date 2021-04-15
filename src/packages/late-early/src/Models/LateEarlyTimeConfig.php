<?php

namespace GGPHP\LateEarly\Models;

use GGPHP\Core\Models\UuidModel;

class LateEarlyTimeConfig extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'LateEarlyTimeConfigs';

    /**
     * Define const late, early
     */
    const LATE = 'LATE';
    const EARLY = 'EARLY';

    protected $fillable = ['FromTime', 'ToTime', 'Description', 'Type'];
}
