<?php

namespace GGPHP\Attendance\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class AttendanceLog extends UuidModel
{
    use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'AttendanceLogs';

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'AttendanceId', 'Action', 'Reason', 'FileImage', 'Type', 'SchoolYearId'
    ];

    /**
     * Define relations user
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * Define relations user
     */
    public function attendance()
    {
        return $this->belongsTo(\GGPHP\Attendance\Models\Attendance::class, 'AttendanceId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
