<?php

namespace GGPHP\WorkHour\Models;

use GGPHP\Core\Models\UuidModel;

class WorkHour extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkHours';

    const REGISTRATION_DATE_TYPE = [
        'WEEKLY_DAY' => 1,
        'LAST_DAY_OF_THE_WEEK' => 2,
        'HOLIDAY' => 3,
        'EVENT_DATE' => 4
    ];

    const STATUS = [
        'WAITING_APPROVAL' => 1,
        'APPROVED' => 2,
        'NOT_APPROVED' => 3
    ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Date', 'Hours', 'Reason', 'AbsentTypeId', 'RegistrationDateType', 'EventName', 'Status', 'ReasonNotApproved'
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(\GGPHP\Absent\Models\AbsentType::class, 'AbsentTypeId');
    }

    public function approvalEmployeeWorkHour()
    {
        return $this->hasMany(ApprovalEmployeeWorkHour::class, 'WorkHourId');
    }
}
