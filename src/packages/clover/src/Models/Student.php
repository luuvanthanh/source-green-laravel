<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class Student extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.Students';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Source', 'ParentWish', 'ParentWith', 'FullName', 'Note', 'LaborNumber', 'Sex', 'DayOFBirth', 'Age', 'Address', 'Health', 'ClassId',
        'FartherId', 'MotherId', 'CreatorId', 'LastModifierId', 'ConcurrencyStamp', 'DeleterId', 'DeletionTime', 'ExtraProperties', 'IsDeleted',
        'CardNumber', 'Code', 'Comments', 'StudentId', 'RegisterDate', 'StartDate', 'Status', 'FileImage', 'City', 'District', 'Street', 'Ward',
    ];

    /**
     * Define relations Schedule
     */
    public function schedules()
    {
        return $this->hasMany(\GGPHP\YoungAttendance\ShiftSchedule\Models\Schedule::class, 'StudentId');
    }

    /**
     * Define relations Schedule
     */
    public function inOutHistory()
    {
        return $this->hasMany(\GGPHP\InOutHistories\Models\InOutHistories::class, 'StudentId');
    }

    public function classStudent()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\ClassStudent::class, 'Id', 'StudentId');
    }

    /**
     * Define relations Schedule
     */
    public function attendance()
    {
        return $this->hasMany(\GGPHP\Attendance\Models\Attendance::class, 'StudentId');
    }
}
