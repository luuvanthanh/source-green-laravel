<?php

namespace GGPHP\Users\Models;

use GGPHP\Absent\Models\Absent;
use GGPHP\Core\Models\UuidModel;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\Timekeeping\Models\Timekeeping;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use ZK\Traits\SyncToDevice;

class User extends UuidModel implements HasMedia, AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    public $incrementing = false;

    use Notifiable, CanResetPassword;
    use Authenticatable;
    use Authorizable, CanResetPassword, MustVerifyEmail;
    use InteractsWithMedia;
    use SyncToDevice;

    const STATUS = [
        "WORKING" => 0,
        'INACTIVITY' => 1,
        'MATERNITY' => 2,
        'STORE' => 3,
    ];

    /**
     * Declare the table name
     */
    protected $table = 'Employees';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'FullName', 'DateOfBirth', 'PlaceOfBirth', 'Email', 'PhoneNumber', 'Gender', 'Code', 'TaxCode', 'DegreeId',
        'TrainingMajorId', 'TrainingSchoolId', 'DateOff', 'PermanentAddress', 'Nationality',
        'Nation', 'IdCard', 'DateOfIssueIdCard', 'PlaceOfIssueIdCard', 'Religion', 'WorkDate',
        'HealthInsuranceBookNumber', 'HospitalAddress', 'SocialInsuranceBooknumber', 'BankName',
        'BankNumberOfAccount', 'Note', 'MaternityLeave', 'MaternityLeaveFrom', 'MaternityLeaveTo',
        'EducationalLevelId', 'Address', 'Status', 'FingerprintId', 'FileImage',
    ];

    /**
     * Get educations of employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timekeeping()
    {
        return $this->hasMany(Timekeeping::class, 'EmployeeId');
    }

    /**
     * Define relations Schedule
     */
    public function schedules()
    {
        return $this->hasMany(\GGPHP\ShiftSchedule\Models\Schedule::class, 'EmployeeId');
    }

    /**
     * Define relations absent
     */
    public function absent()
    {
        return $this->hasMany(Absent::class, 'EmployeeId');
    }

    /**
     * Define relations late earlies
     */
    public function lateEarly()
    {
        return $this->hasMany(LateEarly::class, 'EmployeeId');
    }

    /**
     * Define relations store
     */
    public function addSubTime()
    {
        return $this->hasMany(\GGPHP\AddSubTime\Models\AddSubTime::class, 'EmployeeId');
    }

    /**
     * Define relations reviews
     */
    public function revokeShifts()
    {
        return $this->hasMany(\GGPHP\RevokeShift\Models\RevokeShift::class, 'EmployeeId');
    }

    /**
     * Get profiles of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function positionLevel()
    {
        return $this->hasMany(PositionLevel::class, 'EmployeeId');
    }

    public function workHours()
    {
        return $this->hasMany(\GGPHP\WorkHour\Models\WorkHour::class, 'EmployeeId');
    }

    /**
     * Get profiles of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workDeclarations()
    {
        return $this->hasMany(\GGPHP\WorkDeclaration\Models\WorkDeclaration::class, 'EmployeeId');
    }
}
