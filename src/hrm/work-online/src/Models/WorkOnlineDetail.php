<?php

namespace GGPHP\WorkOnline\Models;

use Carbon\Carbon;
use GGPHP\Core\Models\UuidModel;

class WorkOnlineDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkOnlineDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StartTime', 'EndTime', 'TotalHour', 'WorkOnlineId', 'Date', 'ShiftCode', 'IsFullDate'
    ];

    /**
     * Define relations user
     */
    public function workOnline()
    {
        return $this->belongsTo(\GGPHP\WorkOnline\Models\WorkOnline::class, 'WorkOnlineId');
    }
}
