<?php

namespace GGPHP\Arkki\Models;

use GGPHP\Core\Models\UuidModel;

class TeachingShift extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'distribution.TeachingShifts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Note', 'FromTime', 'ToTime'
    ];
}
