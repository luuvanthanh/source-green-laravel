<?php

namespace GGPHP\Attendance\Models;

use GGPHP\Core\Models\UuidModel;

class Attendance extends UuidModel
{
    const STATUS = [
        'ANNUAL_LEAVE' => 1,
        'UNPAID_LEAVE' => 2,
        'HAVE_IN' => 3,
        'HAVE_OUT' => 4,
    ];

    /**
     * Declare the table name
     */
    protected $table = 'Attendances';

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'StudentId', 'Date', 'Status', 'CheckIn', 'CheckOut', 'ReasonId', 'Reason',
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * Define relations user
     */
    public function student()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Student::class, 'StudentId');
    }

    /**
     * Define relations user
     */
    public function attendanceReason()
    {
        return $this->hasOne(\GGPHP\Attendance\Models\AttendanceReason::class, 'ReasonId');
    }

    /**
     * Define relations user
     */
    public function attendanceLog()
    {
        return $this->hasMany(\GGPHP\Attendance\Models\AttendanceLog::class, 'AttendanceId');
    }
}
