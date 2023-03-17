<?php

namespace GGPHP\Clover\Models;


use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Category\Models\Branch;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\StudyProgram\AttendancePhysical\Models\AttendancePhysical;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends UuidModel
{
    //use ActivityLogTrait;
    use SoftDeletes;

    const DELETED_AT = 'DeletionTime';

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.Students';

    // const REGIST = 0;
    // const JOIN_CLASS = 1;
    // const LEAVE_SCHOOL = 2;
    // const STORE = 3;

    const REGISTED = 0;
    const OFFICAL = 2;
    const WITHDRAW_APPLICATION = 3;
    const STOP_STUDYING = 4;
    const STORE = 5;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Source', 'ParentWish', 'ParentWith', 'FullName', 'Note', 'LaborNumber', 'Sex', 'DayOfBirth', 'Age', 'Address', 'Health', 'ClassId',
        'FartherId', 'MotherId', 'CreatorId', 'LastModifierId', 'ConcurrencyStamp', 'DeleterId', 'DeletionTime', 'ExtraProperties', 'IsDeleted',
        'CardNumber', 'Code', 'Comments', 'StudentId', 'RegisterDate', 'StartDate', 'Status', 'FileImage', 'City', 'District', 'Street', 'Ward',
        'WithdrawApplicationDate', 'WithdrawApplicationNote', 'WithdrawApplicationReason', 'RestoredDate', 'BranchId'
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
        return $this->belongsTo(\GGPHP\Clover\Models\ClassStudent::class, 'Id', 'StudentId')->where('IsLastest', true);
    }

    /**
     * Define relations Schedule
     */
    public function attendance()
    {
        return $this->hasMany(\GGPHP\Attendance\Models\Attendance::class, 'StudentId');
    }

    /**
     * Define relations Schedule
     */
    public function absent()
    {
        return $this->hasMany(\GGPHP\YoungAttendance\Absent\Models\Absent::class, 'StudentId');
    }

    /**
     * Define relations Schedule
     */
    public function parent()
    {
        return $this->belongsToMany(\GGPHP\Clover\Models\Parents::class, 'object.StudentParents', 'StudentId', 'ParentId');
    }

    /**
     * Define relations Schedule
     */
    public function studentTransporter()
    {
        return $this->hasMany(\GGPHP\Clover\Models\StudentTransporter::class, 'StudentId');
    }

    /**
     * Define relations Schedule
     */
    public function testSemester()
    {
        return $this->hasMany(TestSemester::class, 'StudentId');
    }

    public function chargeOldStudent()
    {
        return $this->hasMany(ChargeOldStudent::class, 'StudentId');
    }

    public function classes()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\Classes::class, 'ClassId', 'Id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function quarterReport()
    {
        return $this->hasMany(QuarterReport::class, 'StudentId');
    }

    public function monthlyComment()
    {
        return $this->hasMany(MonthlyComment::class, 'StudentId');
    }

    public function attendancePhysical()
    {
        return $this->hasMany(AttendancePhysical::class, 'StudentId');
    }
}
