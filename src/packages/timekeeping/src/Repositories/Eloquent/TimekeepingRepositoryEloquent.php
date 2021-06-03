<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Presenters\TimekeepingPresenter;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TimekeepingRepositoryEloquent extends CoreRepositoryEloquent implements TimekeepingRepository
{
    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Timekeeping::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return TimekeepingPresenter::class;
    }

    public function filterTimekeeping(array $attribute)
    {

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['deviceId'])) {
                $query->where('DeviceId', $attribute['deviceId']);
            }
            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            };
        })->with(['timekeeping' => function ($query) use ($attribute) {
            if (!empty($attribute['type'])) {
                $query->where('Type', $attribute['type']);
            }

            if (!empty($attribute['deviceId'])) {
                $query->where('DeviceId', $attribute['deviceId']);
            }

            if (!empty($attribute['startDate']) && !empty($attribute['endDate'])) {
                $query->whereDate('AttendedAt', '>=', Carbon::parse($attribute['startDate'])->format('Y-m-d'))
                    ->whereDate('AttendedAt', '<=', Carbon::parse($attribute['endDate'])->format('Y-m-d'));
            };
        }]);

        if (!empty($attributes['fullName'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereLike('FullName', $attributes['fullName']);
        }

        if (!empty($attribute['employeeId'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('timekeeping', function ($query) use ($attribute) {
                $query->whereIn('EmployeeId', explode(',', $attribute['employeeId']));
            });
        }

        $timekeeping = !empty($attribute['limit']) ? $this->employeeRepositoryEloquent->paginate($attribute['limit']) : $this->employeeRepositoryEloquent->get();

        return $timekeeping;
    }

    /**
     * @param $employeeId
     * @param $position
     * @param $store
     * @param $startDate
     * @param $endDate
     * @param $limit
     * @param bool $parser
     * @param $type
     * @param null $work_form_id
     * @param null $isFilter
     * @param null $rank
     * @return mixed
     */
    public function timekeepingReport(array $attributes)
    {

        $employeesByStore = $this->employeeRepositoryEloquent->model()::with(['timekeeping' => function ($query) use ($attributes) {
            $query->whereDate('AttendedAt', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                ->whereDate('AttendedAt', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'))
                ->orderBy('AttendedAt');
        }]);

        $employeesByStore->with(['workDeclarations' => function ($query) use ($attributes) {
            $query->where('Date', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('Date', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }]);

        if (!empty($attributes['isShift'])) {
            $employeesByStore->whereHas('schedules', function ($query) use ($attributes) {
                $query->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]]);
            });
        }

        if (!empty($attributes['fullName'])) {
            $employeesByStore->whereLike('FullName', $attributes['fullName']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $employeesByStore->whereIn('Id', $employeeId);
        }

        $employeesByStore->tranferHistory($attributes);

        if (empty($attributes['limit'])) {
            $result = $employeesByStore->get();
        } else {
            $result = $employeesByStore->paginate($attributes['limit']);
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorTimekeepingReport($employee, $attributes);
        }

        return $this->employeeRepositoryEloquent->parserResult($result);
    }

    /**
     * Get timekeeping report
     * @param $employee
     * @param $startDate
     * @param $endDate
     * @param null $type
     * @return array
     */
    public function calculatorTimekeepingReport($employee, $attributes)
    {
        $startDate = $attributes['startDate'];
        $endDate = $attributes['endDate'];
        $now = Carbon::now();

        $this->employee = $employee;
        $employeeTimekeeping = [];
        $result = [];
        $responseTimeKeepingUser = [];
        $timeKeepingByDate = [];
        $workDeclarationByDate = [];
        $dateOff = $employee->DateOff ? $employee->DateOff->format('Y-m-d') : null;
        // dd($dateOff);
        // thoi gian cham cong
        $employeeHasTimekeeping = $employee->timekeeping;

        // get thoi gian cham cong theo ngay
        foreach ($employeeHasTimekeeping as $timekeeping) {
            $timeKeepingByDate[Carbon::parse($timekeeping->AttendedAt)->format('Y-m-d')][] = $timekeeping;
        }

        foreach ($employee->workDeclarations as $workDeclaration) {
            $workDeclarationByDate[Carbon::parse($workDeclaration->Date)->format('Y-m-d')][] = $workDeclaration;
        }

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $startDate, $endDate);
        $begin = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $intervalDate = \DateInterval::createFromDateString('1 day');
        $periodDate = new \DatePeriod($begin, $intervalDate, $end);
        foreach ($periodDate as $date) {
            if (!is_null($dateOff) && $date->format('Y-m-d') >= $dateOff) {
                break;
            }

            if (!array_key_exists($date->format('Y-m-d'), $employeeTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    "date" => $date->format('Y-m-d'),
                    "timekeepingReport" => 0,
                    "type" => "KC",
                ];
            }

            if ($date <= $now && !array_key_exists($date->format('Y-m-d'), $timeKeepingByDate)) {
                $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        "date" => $date->format('Y-m-d'),
                        "timekeepingReport" => 0,
                        "type" => "KXD",
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        "date" => $date->format('Y-m-d'),
                        "timekeepingReport" => 0,
                        "type" => "KXD",
                    ];
                }
            }
        }

        if (count($employeeHasTimekeeping) > 0) {
            $count = count($employeeTimeWorkShift);
            $i = 1;
            foreach ($employeeTimeWorkShift as $key => $value) {

                if (!is_null($dateOff) && $key >= $dateOff) {
                    break;
                }

                if (!empty($timeKeepingByDate[$key])) {
                    $startTime = $value[0]['AfterStart'] ? $value[0]['AfterStart'] : $value[0]['StartTime'];
                    $endTime = end($value)['BeforeEnd'] ? end($value)['BeforeEnd'] : end($value)['EndTime'];
                    $checkIn = $timeKeepingByDate[$key][0]->AttendedAt->format('H:i:s');
                    $checkOut = end($timeKeepingByDate[$key])->AttendedAt->format('H:i:s');

                    if ($checkIn <= $startTime && $checkOut >= $endTime) {
                        $type = 'x';
                        $timekeepingReport = 1;
                    } else {
                        $type = 'KXD';
                        $timekeepingReport = 0;
                    }

                    $result = [
                        'date' => $key,
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
                    ];
                    $responseTimeKeepingUser[] = $result;
                    $i++;
                }

            }

        }

        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff);
        $responseTimeKeepingUser = $this->calculatorBusinessTravel($employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff);
        $responseTimeKeepingUser = $this->calculatorMaternityLeave($employee, $startDate, $endDate, $responseTimeKeepingUser, $periodDate, $dateOff);
        $totalWorks = 0;

        foreach ($responseTimeKeepingUser as &$item) {
            $totalWorks += $item['timekeepingReport'];
        }

        $employee->totalWorks = $totalWorks;

        $employee->timeKeepingReport = $responseTimeKeepingUser;

        return $employee;
    }

    /**
     * Calculator Absents
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorAbsents(&$employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff)
    {

        $absents = $employee->absent()->whereHas('absentDetail', function ($query) use ($startDate, $endDate) {
            $query->where('Date', '>=', $startDate)->where('Date', '<=', $endDate);
        })->get();

        foreach ($absents as $absent) {
            $code = $absent->absentType->Code;
            $isTimeKeeping = $absent->absentType->IsTimeKeeping;

            foreach ($absent->absentDetail as $value) {

                if (!is_null($dateOff) && $value->Date->format('Y-m-d') >= $dateOff) {
                    break;
                }

                $checkValue = array_search($value->Date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                $type = $value->IsFullDate ? $code : $code . "/2";

                if ($isTimeKeeping) {
                    $timekeepingReport = $value->IsFullDate ? 1 : 0.5;
                } else {
                    $timekeepingReport = 0;
                }

                if (!$value->IsFullDate) {

                    if (!isset($timeKeepingByDate[$value->Date->format('Y-m-d')])) {
                        $type = $type . ' - KXD';
                        $timekeepingReport = $isTimeKeeping ? 0.5 : 0;
                    } else {
                        $timeKeeping = $timeKeepingByDate[$value->Date->format('Y-m-d')];
                        $shifts = $employeeTimeWorkShift[$value->Date->format('Y-m-d')];
                        $key = array_search($value['StartTime'], array_column($shifts, 'StartTime'));
                        unset($shifts[$key]);
                        $shifts = array_values($shifts);

                        $startTime = $shifts[0]['AfterStart'];
                        $endTime = $shifts[0]['BeforeEnd'];

                        $checkIn = $timeKeeping[0]->AttendedAt->format('H:i:s');
                        $checkOut = end($timeKeeping)->AttendedAt->format('H:i:s');

                        if ($checkIn <= $startTime && $checkOut >= $endTime) {
                            $timekeepingReport = $isTimeKeeping ? 1 : 0.5;
                        } else {
                            $type = $type . ' - KXD';
                            $timekeepingReport = $isTimeKeeping ? 0.5 : 0;
                        }

                        if (isset($workDeclarationByDate[$value->Date->format('Y-m-d')])) {
                            foreach ($workDeclarationByDate[$value->Date->format('Y-m-d')] as $workDeclaration) {
                                if ($workDeclaration->Time < $checkIn) {
                                    $checkIn = $workDeclaration->Time;
                                }

                                if ($workDeclaration->Time > $checkOut) {
                                    $checkOut = $workDeclaration->Time;
                                }
                            }

                            if ($checkIn <= $startTime && $checkOut >= $endTime) {
                                $type = $code . '/2' . ' - BS';
                                $timekeepingReport = $isTimeKeeping ? 1 : 0.5;
                            }
                        }

                    }
                }

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                }

            }
        }

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator Absents
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorMaternityLeave(&$employee, $startDate, $endDate, $responseTimeKeepingUser, $periodDate, $dateOff)
    {
        $maternityLeaves = $employee->maternityLeave()->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
        })->get();

        foreach ($maternityLeaves as $maternityLeave) {

            foreach ($periodDate as $date) {
                if (!is_null($dateOff) && $date->format('Y-m-d') >= $dateOff) {
                    break;
                }

                if ($maternityLeave->StartDate->format('Y-m-d') <= $date->format('Y-m-d') && $date->format('Y-m-d') <= $maternityLeave->EndDate->format('Y-m-d')) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "TS",
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            "date" => $date->format('Y-m-d'),
                            "timekeepingReport" => 0,
                            "type" => "TS",
                        ];
                    }
                }
            }
        }

        return $responseTimeKeepingUser;
    }

    /**
     * Calculator Absents
     * @param object $employee
     * @param string $startDate
     * @param string $endDate
     */
    public function calculatorBusinessTravel(&$employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff)
    {
        $businessCards = $employee->businessCard()->whereHas('businessCardDetail', function ($query) use ($startDate, $endDate) {
            $query->where('Date', '>=', $startDate)->where('Date', '<=', $endDate);
        })->whereHas('absentType', function ($query) {
            $query->where('Type', 'BUSINESS_TRAVEL');
        })->get();

        foreach ($businessCards as $businessCard) {
            $code = $businessCard->absentType->Code;
            $isTimeKeeping = $businessCard->absentType->IsTimeKeeping;

            foreach ($businessCard->businessCardDetail as $value) {
                if (!is_null($dateOff) && $value->Date->format('Y-m-d') >= $dateOff) {
                    break;
                }

                $checkValue = array_search($value->Date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                $type = $value->IsFullDate ? $code : $code . "/2";
                if ($isTimeKeeping) {
                    $timekeepingReport = $value->IsFullDate ? 1 : 0.5;
                } else {
                    $timekeepingReport = 0;
                }

                if (!$value->IsFullDate) {
                    if (!isset($timeKeepingByDate[$value->Date->format('Y-m-d')])) {
                        $type = $type . ' - KXD';
                        $timekeepingReport = $isTimeKeeping ? 0.5 : 0;
                    } else {
                        $timeKeeping = $timeKeepingByDate[$value->Date->format('Y-m-d')];
                        $shifts = $employeeTimeWorkShift[$value->Date->format('Y-m-d')];
                        $key = array_search($value['StartTime'], array_column($shifts, 'StartTime'));
                        unset($shifts[$key]);
                        $shifts = array_values($shifts);

                        $startTime = $shifts[0]['AfterStart'];
                        $endTime = $shifts[0]['BeforeEnd'];

                        $checkIn = $timeKeeping[0]->AttendedAt->format('H:i:s');
                        $checkOut = end($timeKeeping)->AttendedAt->format('H:i:s');

                        if ($checkIn <= $startTime && $checkOut >= $endTime) {
                            $timekeepingReport = $isTimeKeeping ? 1 : 0.5;
                        } else {
                            $type = $type . ' - KXD';
                            $timekeepingReport = $isTimeKeeping ? 0.5 : 0;
                        }

                        if (isset($workDeclarationByDate[$value->Date->format('Y-m-d')])) {
                            foreach ($workDeclarationByDate[$value->Date->format('Y-m-d')] as $workDeclaration) {
                                if ($workDeclaration->Time < $checkIn) {
                                    $checkIn = $workDeclaration->Time;
                                }

                                if ($workDeclaration->Time > $checkOut) {
                                    $checkOut = $workDeclaration->Time;
                                }
                            }

                            if ($checkIn <= $startTime && $checkOut >= $endTime) {
                                $type = $code . '/2' . ' - BS';
                                $timekeepingReport = $isTimeKeeping ? 1 : 0.5;
                            }
                        }
                    }
                }

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        "date" => $value->Date->format('Y-m-d'),
                        "timekeepingReport" => $timekeepingReport,
                        "type" => $type,
                    ];
                }

            }
        }

        return $responseTimeKeepingUser;
    }

    public function invalidTimekeeping(array $attributes)
    {
        $employeesByStore = $this->employeeRepositoryEloquent->model()::whereHas('timekeeping', function ($query) use ($attributes) {
            $query->whereDate('AttendedAt', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                ->whereDate('AttendedAt', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'))
                ->orderBy('AttendedAt');
        })->with(['timekeeping' => function ($query) use ($attributes) {
            $query->whereDate('AttendedAt', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                ->whereDate('AttendedAt', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'))
                ->orderBy('AttendedAt');
        }]);

        $employeesByStore->whereHas('schedules', function ($query) use ($attributes) {
            $query->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]]);
            });
        });

        $employeesByStore->with(['workDeclarations' => function ($query) use ($attributes) {
            $query->where('Date', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))->where('Date', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
        }]);

        $employeesByStore->with(['businessCard' => function ($query) use ($attributes) {
            $query->whereHas('businessCardDetail', function ($q) use ($attributes) {
                $q->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            });
        }]);

        $employeesByStore->with(['absent' => function ($query) use ($attributes) {
            $query->whereHas('absentDetail', function ($q) use ($attributes) {
                $q->where('Date', '>=', $attributes['startDate'])->where('Date', '<=', $attributes['endDate']);
            });
        }]);

        if (!empty($attributes['fullName'])) {
            $employeesByStore->whereLike('FullName', $attributes['fullName']);
        }

        $employeesByStore->tranferHistory($attributes);

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $employeesByStore->whereIn('Id', $employeeId);
        }

        if (empty($attributes['limit'])) {
            $result = $employeesByStore->get();
        } else {
            $result = $employeesByStore->paginate($attributes['limit']);
        }

        foreach ($result as $key => &$employee) {
            $employee = $this->calculatorInvalidReport($employee, $attributes, $key);

            if (!$employee) {
                unset($result[$key]);
            }
        }
        return $this->employeeRepositoryEloquent->parserResult($result);
    }

    public function calculatorInvalidReport($employee, $attributes, $key)
    {
        $startDate = $attributes['startDate'];
        $endDate = $attributes['endDate'];
        $type = !empty($attributes['type']) ? $attributes['type'] : null;
        $employeeTimekeeping = [];
        $result = [];
        $responseInvalid = [];
        $timeKeepingByDate = [];
        $workDeclarationByDate = [];
        $absentByDate = [];
        $businessCardByDate = [];

        // thoi gian cham cong
        $employeeHasTimekeeping = $employee->timekeeping;

        // get thoi gian cham cong theo ngay
        foreach ($employeeHasTimekeeping as $timekeeping) {
            $timeKeepingByDate[Carbon::parse($timekeeping->AttendedAt)->format('Y-m-d')][] = $timekeeping;
        }

        foreach ($employee->workDeclarations as $workDeclaration) {
            $workDeclarationByDate[Carbon::parse($workDeclaration->Date)->format('Y-m-d')][] = $workDeclaration;
        }

        foreach ($employee->businessCard as $businessCard) {
            foreach ($businessCard->businessCardDetail as $businessCardDetail) {
                $businessCardByDate[Carbon::parse($businessCardDetail->Date)->format('Y-m-d')][] = $businessCardDetail;
            }
        }

        foreach ($employee->absent as $absent) {
            foreach ($absent->absentDetail as $absentDetail) {
                $absentByDate[Carbon::parse($absentDetail->Date)->format('Y-m-d')][] = $absentDetail;
            }
        }

        $employeeTimeWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($employee->Id, $startDate, $endDate);

        foreach ($employeeTimeWorkShift as $key => $value) {
            $checkAbsent = isset($absentByDate[$key]) ? $absentByDate[$key][0]->IsFullDate : false;
            $checkBusinessCard = isset($businessCardByDate[$key]) ? $businessCardByDate[$key][0]->IsFullDate : false;

            if (!empty($timeKeepingByDate[$key]) && !$checkAbsent && !$checkBusinessCard) {

                $isInvalid = false;

                $startTime = $value[0]['AfterStart'] ? $value[0]['AfterStart'] : $value[0]['StartTime'];
                $endTime = end($value)['BeforeEnd'] ? end($value)['BeforeEnd'] : end($value)['EndTime'];

                $checkIn = $timeKeepingByDate[$key][0]->AttendedAt->format('H:i:s');
                $checkOut = count($timeKeepingByDate[$key]) > 1 ? end($timeKeepingByDate[$key])->AttendedAt->format('H:i:s') : null;
                if (isset($businessCardByDate[$key])) {
                    foreach ($businessCardByDate[$key] as $businessCard) {
                        if ($businessCard->StartTime < $checkIn) {
                            $checkIn = $businessCard->StartTime;
                        }

                        if ($businessCard->EndTime > $checkOut) {
                            $checkOut = $businessCard->EndTime;
                        }
                    }
                }

                if (isset($absentByDate[$key])) {
                    foreach ($absentByDate[$key] as $absent) {
                        if ($absent->StartTime < $checkIn) {
                            $checkIn = $absent->StartTime;
                        }

                        if ($absent->EndTime > $checkOut) {
                            $checkOut = $absent->EndTime;
                        }
                    }
                }

                if (isset($workDeclarationByDate[$key])) {
                    foreach ($workDeclarationByDate[$key] as $workDeclaration) {
                        if ($workDeclaration->Time < $checkIn) {
                            $checkIn = $workDeclaration->Time;
                        }

                        if ($workDeclaration->Time > $checkOut) {
                            $checkOut = $workDeclaration->Time;
                        }
                    }
                }

                if (count($timeKeepingByDate[$key]) < 1) {
                    $isInvalid = true;
                }

                if ($checkIn > $startTime || $checkOut < $endTime) {
                    $isInvalid = true;
                }

                foreach ($value as $keyItem => $item) {
                    foreach ($item as $keyItem2 => $item2) {
                        $newkeyItem2 = dashesToCamelCase($keyItem2, false);
                        if ($keyItem2 != $newkeyItem2) {
                            $item[$newkeyItem2] = $item[$keyItem2];

                            unset($item[$keyItem2]);
                        }
                    }
                    $value[$keyItem] = $item;
                }

                $timekeeping = [];
                foreach ($timeKeepingByDate[$key] as $attribute) {
                    $attributes = $attribute->toArray();

                    foreach ($attributes as $keyItem => $item) {
                        $newkeyItem = dashesToCamelCase($keyItem, false);

                        if ($keyItem != $newkeyItem) {
                            $attributes[$newkeyItem] = $attributes[$keyItem];
                            unset($attributes[$keyItem]);
                        }
                    }
                    $timekeeping[] = $attributes;
                }

                if ($isInvalid) {
                    $result = [
                        'date' => $key,
                        'shift' => $value,
                        'timekeeping' => $timekeeping,
                        'checkIn' => $checkIn,
                        'checkOut' => $checkOut,
                        'isInvalid' => $isInvalid,
                    ];

                    $responseInvalid[] = $result;
                }

            }
        }
        $employee->responseInvalid = $responseInvalid;

        if (empty($responseInvalid)) {
            return false;
        }

        return true;
    }

}
