<?php

namespace GGPHP\WorkHour\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class ApprovalEmployeeWorkHour extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'ApprovalEmployeeWorkHours';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'WorkHourId'
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }
}
