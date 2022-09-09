<?php

namespace GGPHP\YoungAttendance\Absent\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class Absent extends UuidModel
{
    public $incrementing = false;

    protected $table = 'AbsentStudents';

    protected $fillable = [
        'AbsentTypeId', 'AbsentReasonId', 'ParentId', 'StudentId', 'StartDate', 'EndDate', 'Status', 'EmployeeId', 'ExpectedDate', 'SchoolYearId'
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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Parents::class, 'ParentId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Student::class, 'StudentId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentType()
    {
        return $this->belongsTo(AbsentType::class, 'AbsentTypeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentStudentDetail()
    {
        return $this->hasMany(AbsentStudentDetail::class, 'AbsentStudentId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function absentReason()
    {
        return $this->belongsTo(AbsentReason::class, 'AbsentReasonId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
