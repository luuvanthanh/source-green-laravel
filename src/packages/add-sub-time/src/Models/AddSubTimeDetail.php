<?php

namespace GGPHP\AddSubTime\Models;

use GGPHP\Core\Models\UuidModel;

class AddSubTimeDetail extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AddSubTimeDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'AddSubTimeId', 'EmployeeId', 'StartDate', 'EndDate', 'Days', 'Hours', 'Reason',
    ];

    protected $dateTimeFields = [
        'StartDate',
        'EndDate',
    ];

    protected $casts = [
        'StartDate' => 'datetime',
        'EndDate' => 'datetime',
    ];

    /**
     * Define relations store
     */
    public function addSubTime()
    {
        return $this->belongsTo(AddSubTime::class, 'AddSubTimeId');
    }

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
