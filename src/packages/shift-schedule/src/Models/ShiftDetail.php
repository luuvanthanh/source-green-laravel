<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\Core\Models\CoreModel;

class ShiftDetail extends CoreModel
{
    /**
     * Declare the table name
     */
    protected $table = 'shift_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shift_id', 'start_time', 'end_time', 'meal_time',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

}
