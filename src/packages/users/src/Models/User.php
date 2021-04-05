<?php

namespace GGPHP\Users\Models;

use GGPHP\Absent\Models\Absent;
use GGPHP\Core\Models\CoreModel;
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

class User extends CoreModel implements HasMedia, AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Notifiable, CanResetPassword;
    use Authenticatable;
    use Authorizable, CanResetPassword, MustVerifyEmail;
    use InteractsWithMedia;
    use SyncToDevice;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name',
    ];

    /**
     * getTotalRealTimekeeping
     */
    public function getTotalRealTimekeepingAttribute()
    {
        return isset($this->attributes['totalRealTimekeeping']) ? $this->attributes['totalRealTimekeeping'] : 0;
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
        return isset($this->attributes['totalHourRedundantTimekeeping']) ? $this->attributes['totalHourRedundantTimekeeping'] : 0;
    }

    /**
     * getWorkHourRedundant
     */
    public function getWorkHourRedundantAttribute()
    {
        return isset($this->attributes['workHourRedundant']) ? $this->attributes['workHourRedundant'] : 0;
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
     * Get educations of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timekeeping()
    {
        return $this->hasMany(Timekeeping::class, 'user_id');
    }

    /**
     * Define relations Schedule
     */
    public function schedules()
    {
        return $this->hasMany(\GGPHP\ShiftSchedule\Models\Schedule::class);
    }

    /**
     * Define relations absent
     */
    public function absent()
    {
        return $this->hasMany(Absent::class);
    }

    /**
     * Define relations late earlies
     */
    public function lateEarly()
    {
        return $this->hasMany(LateEarly::class);
    }

    /**
     * Count Annual Absents
     * @param null $start_date
     * @param null $end_date
     * @param string $type
     * @return array
     */
    public function countAbsents($start_date = null, $end_date = null, $type = null)
    {
        // tong hop theo nam
        if (is_null($type)) {
            $months = [];
            $year = Carbon::parse($start_date)->format('Y');

            for ($i = 1; $i <= 12; $i++) {
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['start_date'] = date("$year-m-d", strtotime(date("$year") . "-" . $i . "-01"));
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['end_date'] = date("$year-m-t", strtotime(date("$year") . "-" . $i));
            }

            $resultAbsentYear = [];

            foreach ($months as $key => &$month) {
                $absents = $this->calculatorAbsent($month['start_date'], $month['end_date'], AbsentType::ANNUAL_LEAVE);
                $unpaid = $this->calculatorAbsent($month['start_date'], $month['end_date'], AbsentType::UNPAID_LEAVE);
                $awol = $this->calculatorAbsent($month['start_date'], $month['end_date'], AbsentType::AWOL);

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
     * @param null $start_date
     * @param null $end_date
     * @param null $type
     * @return int
     */
    public function calculatorAbsent($start_date = null, $end_date = null, $type = null)
    {
        $count = 0;

        $query = $this->absent()->join('absent_types', 'absent_types.id', '=', 'absents.absent_type_id');
        if (!empty($type)) {
            $query->where('absent_types.type', $type);
            if ($type === AbsentType::AWOL) {

            } else {
                $query->approved();
            }
        }

        if ($start_date && $end_date) {
            $query->where(function ($q) use ($start_date, $end_date) {
                $q->where(function ($q1) use ($start_date, $end_date) {
                    $q1->where('absents.start_date', '>=', $start_date);
                    $q1->where('absents.start_date', '<=', $end_date);
                });
                $q->orWhere(function ($q2) use ($start_date, $end_date) {
                    $q2->where('absents.end_date', '>=', $start_date);
                    $q2->where('absents.end_date', '<=', $end_date);
                });
            });
        }

        $absents = $query->get();
        if ($absents->isNotEmpty()) {
            foreach ($absents as $item) {
                $monthStart = Carbon::parse($start_date)->format('Y-m');
                $monthEnd = Carbon::parse($end_date)->format('Y-m');
                if (Carbon::parse($item->start_date)->format('Y-m') == $monthStart && Carbon::parse($item->end_date)->format('Y-m') == $monthStart) {
                    $count += Carbon::parse($item->end_date)->diffInDays($item->start_date) + 1;
                } elseif (Carbon::parse($item->end_date)->format('Y-m') > $monthStart) {
                    $endOfMonth = Carbon::parse($item->start_date)->endOfMonth();
                    $count += $endOfMonth->diffInDays(Carbon::parse($item->start_date)) + 1;
                } elseif ($monthStart > Carbon::parse($item->start_date)->format('Y-m')) {
                    $startOfMonth = Carbon::parse($item->end_date)->startOfMonth();
                    $count += Carbon::parse($item->end_date)->diffInDays($startOfMonth) + 1;
                }

            }
        }
        return $count;
    }
}
