<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class TimetableSetting extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'schedule.TimetableSettings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FromYear', 'ToYear', 'FromDate', 'ToDate', 'FromTime', 'ToTime', 'PeriodDuration',
        'IsActive', 'ExtraProperties', 'ConcurrencyStamp', 'IsDelete'
    ];
}
