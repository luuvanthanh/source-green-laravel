<?php

namespace GGPHP\Fee\Models;

use GGPHP\Core\Models\UuidModel;

class Timetable extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.Timetables';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'SchoolYearId', 'Month', 'Week', 'StartDate', 'EndDate',
    ];

}
