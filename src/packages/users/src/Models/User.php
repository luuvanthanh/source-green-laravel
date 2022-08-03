<?php

namespace GGPHP\Users\Models;

use Carbon\Carbon;
use CloudCreativity\LaravelJsonApi\Eloquent\HasMany;
use GGPHP\Absent\Models\Absent;
use GGPHP\Category\Models\Degree;
use GGPHP\Category\Models\TrainingMajor;
use GGPHP\Category\Models\TrainingSchool;
use GGPHP\Children\Models\Children;
use GGPHP\Core\Models\UuidModel;
use GGPHP\LateEarly\Models\LateEarly;
use GGPHP\ManualCalculation\Models\ManualCalculation;
use GGPHP\MaternityLeave\Models\MaternityLeave;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\WorkOnline\Models\WorkOnline;
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
        'WORKING' => 0,
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
        'EducationalLevelId', 'Address', 'Status', 'FingerprintId', 'FileImage', 'Married', 'EmployeeIdCrm', 'AccountantId', 'Description',
        'FileAttached', 'IsForeigner', 'LastName'
    ];

    protected $dateTimeFields = [
        'DateOfBirth',
        'DateOfIssueIdCard',
        'DateOff',
    ];

    protected $casts = [
        'DateOfBirth' => 'datetime',
        'DateOfIssueIdCard' => 'datetime',
        'DateOff' => 'datetime',
        'FileAttached' => 'array'
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
     * Define relations businessCard
     */
    public function businessCard()
    {
        return $this->hasMany(\GGPHP\BusinessCard\Models\BusinessCard::class, 'EmployeeId');
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
     * Define relations store
     */
    public function labourContract()
    {
        return $this->hasMany(\GGPHP\Profile\Models\LabourContract::class, 'EmployeeId');
    }

    public function seasonalContract()
    {
        return $this->hasMany(\GGPHP\Profile\Models\SeasonalContract::class, 'EmployeeId');
    }

    /**
     * Define relations store
     */
    public function probationaryContract()
    {
        return $this->hasMany(\GGPHP\Profile\Models\ProbationaryContract::class, 'EmployeeId');
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

    /**
     * Get profiles of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function positionLevelNow()
    {
        $now = Carbon::now()->format('Y-m-d');

        return $this->hasOne(PositionLevel::class, 'EmployeeId')->where(function ($q2) use ($now) {
            $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
        });
    }

    /**
     * Get workHours of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workHours()
    {
        return $this->hasMany(\GGPHP\WorkHour\Models\WorkHour::class, 'EmployeeId');
    }

    /**
     * Get workHours of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function busRegistrations()
    {
        return $this->hasMany(\GGPHP\BusRegistration\Models\BusRegistration::class, 'EmployeeId');
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

    public function classTeacher()
    {
        return $this->belongsTo(\GGPHP\Clover\Models\ClassTeacher::class, 'Id', 'EmployeeId');
    }

    public function scopeTranferHistory($query, $attributes)
    {
        if (!empty($attributes['branchId']) || !empty($attributes['divisionId']) || !empty($attributes['positionId']) || (!empty($attributes['startDate']) && !empty($attributes['endDate']))) {
            $query->whereHas('positionLevel', function ($q) use ($attributes) {
                if (!empty($attributes['branchId'])) {
                    $branchId = explode(',', $attributes['branchId']);
                    $q->whereIn('BranchId', $branchId);
                }

                if (!empty($attributes['divisionId'])) {
                    $divisionId = explode(',', $attributes['divisionId']);
                    $q->whereIn('DivisionId', $divisionId);
                }

                if (!empty($attributes['positionId'])) {
                    $positionId = explode(',', $attributes['positionId']);
                    $q->whereIn('PositionId', $positionId);
                }

                if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                    $q->where(function ($q2) use ($attributes) {
                        $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                            ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                            ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]])
                            ->orWhere([['StartDate', '<=', $attributes['startDate']], ['EndDate', null]]);
                    });
                } else {
                    $now = !empty($attributes['date_tranfer']) ? $attributes['date_tranfer'] : Carbon::now()->format('Y-m-d');
                    $q->where(function ($q2) use ($now) {
                        $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                            ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
                    });
                }
            })->with(['positionLevel' => function ($q) use ($attributes) {
                if (!empty($attributes['branchId'])) {
                    $branchId = explode(',', $attributes['branchId']);
                    $q->whereIn('BranchId', $branchId);
                }

                if (!empty($attributes['divisionId'])) {
                    $divisionId = explode(',', $attributes['divisionId']);
                    $q->whereIn('DivisionId', $divisionId);
                }

                if (!empty($attributes['positionId'])) {
                    $positionId = explode(',', $attributes['positionId']);
                    $q->whereIn('PositionId', $positionId);
                }

                if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                    $q->where(function ($q2) use ($attributes) {
                        $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                            ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                            ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]])
                            ->orWhere([['StartDate', '<=', $attributes['startDate']], ['EndDate', null]]);
                    });
                } else {
                    $now = !empty($attributes['date_tranfer']) ? $attributes['date_tranfer'] : Carbon::now()->format('Y-m-d');
                    $q->where(function ($q2) use ($now) {
                        $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                            ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
                    });
                }
            }]);
        }

        return $query;
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('Status', $status);
    }


    /**
     * Define relations children
     */
    public function children()
    {
        return $this->hasMany(Children::class, 'EmployeeId');
    }

    /**
     * Define relations children
     */
    public function maternityLeave()
    {
        return $this->hasMany(MaternityLeave::class, 'EmployeeId');
    }

    /**
     * Define relations magneticCards
     */
    public function magneticCards()
    {
        return $this->hasMany(\GGPHP\MagneticCard\Models\MagneticCard::class)->withTrashed();
    }

    public function account()
    {
        return $this->hasOne(\GGPHP\Clover\Models\EmployeeAccount::class, 'EmployeeId');
    }

    public function workOnline()
    {
        return $this->hasMany(WorkOnline::class, 'EmployeeId');
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class, 'DegreeId');
    }

    public function trainingMajor()
    {
        return $this->belongsTo(TrainingMajor::class, 'TrainingMajorId');
    }

    public function trainingSchool()
    {
        return $this->belongsTo(TrainingSchool::class, 'TrainingSchoolId');
    }

    public function resignationDecision()
    {
        return $this->hasOne(ResignationDecision::class, 'EmployeeId');
    }

    public function manualCalculation()
    {
        return $this->hasMany(ManualCalculation::class, 'EmployeeId');
    }

    public function branchDefault()
    {
        return $this->hasMany(PositionLevel::class, 'EmployeeId')->where('Type', 'DEFAULT')->latest();
    }
}
