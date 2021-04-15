<?php

namespace GGPHP\AddSubTime\Models;

use GGPHP\Core\Models\UuidModel;

class AddSubTimeDetail extends UuidModel
{
    public $incrementing = false;

    protected $table = 'add_sub_time_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'additional_time_id', 'employee_id', 'start_date', 'end_date', 'days', 'hours', 'reason',
    ];

    protected $dateTimeFields = [
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * Define relations store
     */
    public function addSubTime()
    {
        return $this->belongsTo(AddSubTime::class);
    }

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'employee_id');
    }
}
