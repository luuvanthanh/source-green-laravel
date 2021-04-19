<?php

namespace GGPHP\Users\Models;

use GGPHP\Absent\Models\Absent;
use GGPHP\Core\Models\UuidModel;
use GGPHP\LateEarly\Models\LateEarly;
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
        'EducationalLevelId', 'Address', 'Status', 'FingerprintId',
    ];

    /**
     * getTotalRealTimekeeping
     */
    public function getTotalRealTimekeepingAttribute()
    {
        return isset($this->attributes['TotalRealTimekeeping']) ? $this->attributes['TotalRealTimekeeping'] : 0;
    }

    /**
     * getTotalRealTimekeeping
     */
    public function getLateEarlyConfigAttribute()
    {
        return isset($this->attributes['lateEarlyConfig']) ? $this->attributes['lateEarlyConfig'] : [];
    }

    /**
     * getTotalHourRedundantTimekeeping
     */
    public function getTotalHourRedundantTimekeepingAttribute()
    {
        return isset($this->attributes['TotalHourRedundantTimekeeping']) ? $this->attributes['TotalHourRedundantTimekeeping'] : 0;
    }

    /**
     * getWorkHourRedundant
     */
    public function getWorkHourRedundantAttribute()
    {
        return isset($this->attributes['WorkHourRedundant']) ? $this->attributes['WorkHourRedundant'] : 0;
    }

    /**
     * gettimekeepingByMonthAttribute
     */
    public function getTotalTimekeepingByMonthAttribute()
    {
        return isset($this->attributes['totalTimekeepingByMonth']) ? $this->attributes['totalTimekeepingByMonth'] : 0;
    }

    /**
     * gethourRedundantByMonthAttribute
     */
    public function getTotalHourRedundantByMonthAttribute()
    {
        return isset($this->attributes['totalHourRedundantByMonth']) ? $this->attributes['totalHourRedundantByMonth'] : 0;
    }

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
     * Count Annual Absents
     * @param null $StartDate
     * @param null $EndDate
     * @param string $type
     * @return array
     */
    public function countAbsents($StartDate = null, $EndDate = null, $type = null)
    {
        // tong hop theo nam
        if (is_null($type)) {
            $months = [];
            $year = Carbon::parse($StartDate)->format('Y');

            for ($i = 1; $i <= 12; $i++) {
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['StartDate'] = date("$year-m-d", strtotime(date("$year") . "-" . $i . "-01"));
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['EndDate'] = date("$year-m-t", strtotime(date("$year") . "-" . $i));
            }

            $resultAbsentYear = [];

            foreach ($months as $key => &$month) {
                $absents = $this->calculatorAbsent($month['StartDate'], $month['EndDate'], AbsentType::ANNUAL_LEAVE);
                $unpaid = $this->calculatorAbsent($month['StartDate'], $month['EndDate'], AbsentType::UNPAID_LEAVE);
                $awol = $this->calculatorAbsent($month['StartDate'], $month['EndDate'], AbsentType::AWOL);

                $resultAbsentYear[$key] = [
                    'absents' => $absents,
                    'unpaids' => $unpaid,
                    'awol' => $awol,
                ];
            }

            $collection = collect($resultAbsentYear);

            $annualAbsent = 0;
            $unpaidLeave = 0;
            $awolLeave = 0;

            $annualAbsent += $collection->sum(function ($value) {
                return $value['absents'];
            });

            $unpaidLeave += $collection->sum(function ($value) {
                return $value['unpaids'];
            });

            $awolLeave += $collection->sum(function ($value) {
                return $value['awol'];
            });

            $remaining = $this->sabbaticalLeaves ? $this->sabbaticalLeaves->annual_leave - $annualAbsent : 0;

            $response = [
                'resultAbsents' => $resultAbsentYear,
                'annualAbsent' => $annualAbsent,
                'unpaidLeave' => $unpaidLeave,
                'remaining' => $remaining,
                'awolLeave' => $awolLeave,
            ];
            return $response;
        }
    }

    /**
     * @param null $StartDate
     * @param null $EndDate
     * @param null $type
     * @return int
     */
    public function calculatorAbsent($StartDate = null, $EndDate = null, $type = null)
    {
        $count = 0;

        $query = $this->absent()->join('absent_types', 'absent_types.id', '=', 'absents.AbsentTypeId');
        if (!empty($type)) {
            $query->where('absent_types.type', $type);
            if ($type === AbsentType::AWOL) {

            } else {
                $query->approved();
            }
        }

        if ($StartDate && $EndDate) {
            $query->where(function ($q) use ($StartDate, $EndDate) {
                $q->where(function ($q1) use ($StartDate, $EndDate) {
                    $q1->where('absents.StartDate', '>=', $StartDate);
                    $q1->where('absents.StartDate', '<=', $EndDate);
                });
                $q->orWhere(function ($q2) use ($StartDate, $EndDate) {
                    $q2->where('absents.EndDate', '>=', $StartDate);
                    $q2->where('absents.EndDate', '<=', $EndDate);
                });
            });
        }

        $absents = $query->get();
        if ($absents->isNotEmpty()) {
            foreach ($absents as $item) {
                $monthStart = Carbon::parse($StartDate)->format('Y-m');
                $monthEnd = Carbon::parse($EndDate)->format('Y-m');
                if (Carbon::parse($item->StartDate)->format('Y-m') == $monthStart && Carbon::parse($item->EndDate)->format('Y-m') == $monthStart) {
                    $count += Carbon::parse($item->EndDate)->diffInDays($item->StartDate) + 1;
                } elseif (Carbon::parse($item->EndDate)->format('Y-m') > $monthStart) {
                    $endOfMonth = Carbon::parse($item->StartDate)->endOfMonth();
                    $count += $endOfMonth->diffInDays(Carbon::parse($item->StartDate)) + 1;
                } elseif ($monthStart > Carbon::parse($item->StartDate)->format('Y-m')) {
                    $startOfMonth = Carbon::parse($item->EndDate)->startOfMonth();
                    $count += Carbon::parse($item->EndDate)->diffInDays($startOfMonth) + 1;
                }

            }
        }
        return $count;
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
}
