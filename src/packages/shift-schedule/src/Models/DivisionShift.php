<?php

namespace GGPHP\ShiftSchedule\Models;

use GGPHP\Core\Models\UuidModel;

class DivisionShift extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'DivisionShifts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeCreateId', 'DivisionId', 'ShiftId', 'StartDate', 'EndDate',
    ];

    protected $dateTimeFields = [
        'StartDate',
        'EndDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations employee
     */
    public function employeeCreate()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeCreateId');
    }

    /**
     * Define relations shift
     */
    public function shift()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }

    /**
     * Define relations shift
     */
    public function division()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }
}
