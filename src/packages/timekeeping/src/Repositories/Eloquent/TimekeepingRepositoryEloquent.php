<?php

namespace GGPHP\Timekeeping\Repositories\Eloquent;

use alhimik1986\PhpExcelTemplator\params\CallbackParam;
use alhimik1986\PhpExcelTemplator\PhpExcelTemplator;
use Carbon\Carbon;
use GGPHP\Category\Models\Branch;
use GGPHP\Category\Models\Division;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Presenters\TimekeepingPresenter;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
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
        ExcelExporterServices $excelExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
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

        if (!empty($attribute['fullName'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereLike('FullName', $attribute['fullName']);
        }

        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->status(User::STATUS['WORKING']);

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
    public function timekeepingReport(array $attributes, $parser = false)
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
        $employeesByStore->status(User::STATUS['WORKING']);

        $employeesByStore->where(function ($query) use ($attributes) {
            $query->where('DateOff', '>=', $attributes['startDate'])
                ->orWhere('DateOff', null);
        });

        if (empty($attributes['limit'])) {
            $result = $employeesByStore->get();
        } else {
            $result = $employeesByStore->paginate($attributes['limit']);
        }

        foreach ($result as &$employee) {
            $employee = $this->calculatorTimekeepingReport($employee, $attributes);
        }

        if ($parser) {
            return $result;
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

        $startDate = Carbon::parse($attributes['startDate'])->format('Y-m-d');
        $endDate = Carbon::parse($attributes['endDate'])->format('Y-m-d');
        $now = Carbon::now();

        $this->employee = $employee;
        $result = [];
        $responseTimeKeepingUser = [];
        $timeKeepingByDate = [];
        $workDeclarationByDate = [];
        $dateOff = $employee->DateOff ? $employee->DateOff->format('Y-m-d') : null;
        $dateStartWork = null;
        $contract = $employee->labourContract()->orderBy('CreationTime')->first();

        if (is_null($contract)) {
            $contract = $employee->probationaryContract()->orderBy('CreationTime')->first();
        }

        if (!is_null($contract)) {
            $dateStartWork = $contract->ContractFrom->format('Y-m-d');
        }
        // thoi gian cham cong
        $employeeHasTimekeeping = $employee->timekeeping()->orderBy('AttendedAt')->get();

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
        $periodDate = new \DatePeriod($begin, $intervalDate, $end->modify('+1 day'));

        foreach ($periodDate as $date) {
            $check = Carbon::parse($date)->setTimezone('GMT+7')->format('l');

            if (!is_null($dateOff) && $date->format('Y-m-d') >= $dateOff) {
                $responseTimeKeepingUser[] = [
                    'date' => $date->format('Y-m-d'),
                    'timekeepingReport' => 0,
                    'type' => 'NV',
                ];
            } elseif (!array_key_exists($date->format('Y-m-d'), (array) $employeeTimeWorkShift)) {
                $responseTimeKeepingUser[] = [
                    'date' => $date->format('Y-m-d'),
                    'timekeepingReport' => 0,
                    'type' => 'KC',
                ];
            } elseif ($date <= $now && !array_key_exists($date->format('Y-m-d'), $timeKeepingByDate)) {
                $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        'date' => $date->format('Y-m-d'),
                        'timekeepingReport' => 0,
                        'type' => 'KXD',
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        'date' => $date->format('Y-m-d'),
                        'timekeepingReport' => 0,
                        'type' => 'KXD',
                    ];
                }
            }
            if (($check === 'Saturday' || $check === 'Sunday')) {
                $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        'date' => $date->format('Y-m-d'),
                        'timekeepingReport' => 0,
                        'type' => 'WK',
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        'date' => $date->format('Y-m-d'),
                        'timekeepingReport' => 0,
                        'type' => 'WK',
                    ];
                }
            }
        }

        $countEmployeeHasTimekeeping = count($employeeHasTimekeeping);
        $countWorkDeclarationByDate = count($workDeclarationByDate);

        if ($countEmployeeHasTimekeeping > 0 || $countWorkDeclarationByDate > 0) {

            foreach ($employeeTimeWorkShift as $key => $value) {

                if (!is_null($dateOff) && $key >= $dateOff) {
                    break;
                }

                $startTime = $value[0]['AfterStart'] ? $value[0]['AfterStart'] : $value[0]['StartTime'];
                $endTime = end($value)['BeforeEnd'] ? end($value)['BeforeEnd'] : end($value)['EndTime'];

                if (!empty($timeKeepingByDate[$key])) {

                    $checkIn = $timeKeepingByDate[$key][0]->AttendedAt->format('H:i:s');
                    $checkOut = end($timeKeepingByDate[$key])->AttendedAt->format('H:i:s');

                    if ($checkIn <= $startTime && $checkOut >= $endTime) {
                        $type = 'x';
                        $timekeepingReport = 1;
                    } else {
                        $type = 'KXD';
                        $timekeepingReport = 0;

                        if (isset($workDeclarationByDate[$key])) {
                            arraySortByColumn($workDeclarationByDate[$key], 'Time');
                            foreach ($workDeclarationByDate[$key] as $workDeclaration) {
                                if ($workDeclaration->Time < $checkIn) {
                                    $checkIn = $workDeclaration->Time;
                                }

                                if ($workDeclaration->Time > $checkOut) {
                                    $checkOut = $workDeclaration->Time;
                                }
                            }
                        }

                        if ($checkIn <= $startTime && $checkOut >= $endTime) {
                            $type = 'BS';
                            $timekeepingReport = 1;
                        }
                    }

                    $result = [
                        'date' => $key,
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
                    ];
                    $responseTimeKeepingUser[] = $result;
                } elseif (!empty($workDeclarationByDate[$key])) {
                    arraySortByColumn($workDeclarationByDate[$key], 'Time');
                    $checkIn = $workDeclarationByDate[$key][0]->Time;
                    $checkOut = end($workDeclarationByDate[$key])->Time;

                    if ($checkIn <= $startTime && $checkOut >= $endTime) {
                        $type = 'BS';
                        $timekeepingReport = 1;

                        $checkValue = array_search($key, array_column($responseTimeKeepingUser, 'date'));

                        $result = [
                            'date' => $key,
                            'timekeepingReport' => $timekeepingReport,
                            'type' => $type,
                        ];

                        if ($checkValue !== false) {
                            $responseTimeKeepingUser[$checkValue] = [
                                'date' => $key,
                                'timekeepingReport' => $timekeepingReport,
                                'type' => $type,
                            ];
                        } else {
                            $responseTimeKeepingUser[] = [
                                'date' => $key,
                                'timekeepingReport' => $timekeepingReport,
                                'type' => $type,
                            ];
                        }
                    }
                }
            }
        }

        $responseTimeKeepingUser = $this->calculatorAbsents($employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff);
        $responseTimeKeepingUser = $this->calculatorBusinessTravel($employee, $startDate, $endDate, $responseTimeKeepingUser, $timeKeepingByDate, $employeeTimeWorkShift, $workDeclarationByDate, $dateOff);
        $responseTimeKeepingUser = $this->calculatorMaternityLeave($employee, $startDate, $endDate, $responseTimeKeepingUser, $periodDate, $dateOff, $countEmployeeHasTimekeeping, $countWorkDeclarationByDate);
        $responseTimeKeepingUser = $this->calculatorManualCalcualtion($employee, $startDate, $endDate, $responseTimeKeepingUser);

        $totalWorks = 0;
        foreach ($responseTimeKeepingUser as $key => &$item) {
            $check = Carbon::parse($item['date'])->setTimezone('GMT+7')->format('l');

            if (!is_null($dateStartWork) && $item['date'] == $dateStartWork) {
                $responseTimeKeepingUser[$key]['type'] = 'ST';
            }

            if ($check === 'Saturday' || $check === 'Sunday') {

                if ($responseTimeKeepingUser[$key]['type'] != 'TS') {
                    $responseTimeKeepingUser[$key]['timekeepingReport'] = 0;
                    $responseTimeKeepingUser[$key]['type'] = 'WK';
                }
            } else {
                $totalWorks += $item['timekeepingReport'];
            }
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

                $type = $value->IsFullDate ? $code : $code . '/2';

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
                        if (isset($employeeTimeWorkShift[$value->Date->format('Y-m-d')])) {
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
                                arraySortByColumn($workDeclarationByDate[$value->Date->format('Y-m-d')], 'Time');

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
                }

                if ($checkValue !== false) {
                    $responseTimeKeepingUser[$checkValue] = [
                        'date' => $value->Date->format('Y-m-d'),
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        'date' => $value->Date->format('Y-m-d'),
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
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
    public function calculatorMaternityLeave(&$employee, $startDate, $endDate, $responseTimeKeepingUser, $periodDate, $dateOff, $countEmployeeHasTimekeeping, $countWorkDeclarationByDate)
    {
        $maternityLeaves = $employee->maternityLeave()->where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
        })->get();

        $holidayDetails = HolidayDetail::where(function ($q2) use ($startDate, $endDate) {
            $q2->where([['StartDate', '<=', $startDate], ['EndDate', '>=', $endDate]])
                ->orWhere([['StartDate', '>=', $startDate], ['StartDate', '<=', $endDate]])
                ->orWhere([['EndDate', '>=', $startDate], ['EndDate', '<=', $endDate]]);
        })->get();

        foreach ($periodDate as $date) {
            if (!is_null($dateOff) && $date->format('Y-m-d') >= $dateOff) {
                break;
            }

            if ($countEmployeeHasTimekeeping > 0 || $countWorkDeclarationByDate > 0) {
                foreach ($holidayDetails as $holidayDetail) {
                    if ($holidayDetail->StartDate->format('Y-m-d') <= $date->format('Y-m-d') && $date->format('Y-m-d') <= $holidayDetail->EndDate->format('Y-m-d')) {
                        $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                        $check = Carbon::parse($date)->setTimezone('GMT+7')->format('l');

                        if ($check === 'Saturday' || $check === 'Sunday') {
                            $timekeepingReport = 0;
                        } else {
                            $timekeepingReport = 1;
                        }

                        if ($checkValue !== false) {
                            $responseTimeKeepingUser[$checkValue] = [
                                'date' => $date->format('Y-m-d'),
                                'timekeepingReport' => $timekeepingReport,
                                'type' => 'L',
                            ];
                        } else {
                            $responseTimeKeepingUser[] = [
                                'date' => $date->format('Y-m-d'),
                                'timekeepingReport' => $timekeepingReport,
                                'type' => 'L',
                            ];
                        }
                    }
                }
            }

            foreach ($maternityLeaves as $maternityLeave) {

                if ($maternityLeave->StartDate->format('Y-m-d') <= $date->format('Y-m-d') && $date->format('Y-m-d') <= $maternityLeave->EndDate->format('Y-m-d')) {
                    $checkValue = array_search($date->format('Y-m-d'), array_column($responseTimeKeepingUser, 'date'));

                    if ($checkValue !== false) {
                        $responseTimeKeepingUser[$checkValue] = [
                            'date' => $date->format('Y-m-d'),
                            'timekeepingReport' => 0,
                            'type' => 'TS',
                        ];
                    } else {
                        $responseTimeKeepingUser[] = [
                            'date' => $date->format('Y-m-d'),
                            'timekeepingReport' => 0,
                            'type' => 'TS',
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

                $type = $value->IsFullDate ? $code : $code . '/2';
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
                            arraySortByColumn($workDeclarationByDate[$value->Date->format('Y-m-d')], 'Time');

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
                        'date' => $value->Date->format('Y-m-d'),
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
                    ];
                } else {
                    $responseTimeKeepingUser[] = [
                        'date' => $value->Date->format('Y-m-d'),
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
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
        $employeesByStore->status(User::STATUS['WORKING']);

        $employeesByStore->where(function ($query) use ($attributes) {
            $query->where('DateOff', '>=', $attributes['startDate'])
                ->orWhere('DateOff', null);
        });

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
                    arraySortByColumn($workDeclarationByDate[$key], 'Time');

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

    public function exportTimekeeping(array $attributes)
    {

        $results = $this->timekeepingReport($attributes, true);

        $branch = '.............';
        $division = '.............';
        if (!empty($attributes['branchId'])) {
            $branch = Branch::find($attributes['branchId'])->Name;
        }

        if (!empty($attributes['divisionId'])) {
            $division = Division::find($attributes['divisionId'])->Name;
        }

        $params = [];
        $params['{month}'] = Carbon::parse($attributes['endDate'])->format('m');
        $params['{branch}'] = $branch;
        $params['{division}'] = $division;
        $params['{note}'] = '';
        $params['{work}'] = '';
        $params['{sign}'] = '';
        $params['[number]'] = [];
        $params['[fullName]'] = [];
        $params['[position]'] = [];
        $params['[totalWork]'] = [];
        $params['[sign]'] = [];
        $init_value = [];
        $month = [];

        $period = Carbon::create($attributes['startDate'])->daysUntil($attributes['endDate']);
        $period->setLocale('vi_VN');
        $params['[[date]]'][] = iterator_to_array($period->map(function (Carbon $date) use (&$init_value, &$month) {
            $check = Carbon::parse($date)->setTimezone('GMT+7')->format('l');

            $month[] = 'Tháng ' . $date->format('m');
            if ($check === 'Saturday' || $check === 'Sunday') {
                $init_value[$date->format('Y-m-d')] = ''; // cuối tuần
            } else {
                $init_value[$date->format('Y-m-d')] = '-';
            }

            return $date->format('d');
        }));

        foreach ($results as $key => $user) {
            $params['[number]'][] = ++$key;
            $params['[fullName]'][] = $user->FullName;
            $params['[position]'][] = $user->positionLevelNow->position->Name ?? '';
            $values = $init_value;

            if (!empty($user->timeKeepingReport)) {
                foreach ($user->timeKeepingReport as $item) {
                    if ($item['type'] == 'WK') {
                        $values[$item['date']] = '';
                    } else {
                        $values[$item['date']] = $item['type'] ? $item['type'] : '_';
                    }
                }
            }

            $params['[[values]]'][] = array_values($values);
            $params['[totalWork]'][] = $user->totalWorks;
            $params['[sign]'][] = '';
        }

        $params['[[month]]'][] = array_values($month);

        $listMerge = [];
        $listRowTs = [];

        $callbacks = [
            '[[month]]' => function (CallbackParam $param) use (&$listMerge) {
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $mergeCoordinate[] = $cell_coordinate;
                $firstValue = $param->param[$row_index][0];

                if ($cell_coordinate == 'D3') {
                    $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);
                    for ($i = 0; $i < count($param->param[$row_index]); $i++) {
                        $adjustedColumnIndex = $columnIndex + $i;
                        if ($param->param[$row_index][$i] != $firstValue) {

                            $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex - 1);
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);

                            $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                            $firstValue = $param->param[$row_index][$i];
                        }

                        if ($i == count($param->param[$row_index]) - 1) {
                            $adjustedColumn = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                            $mergeCoordinate[] = $adjustedColumn . $currentRow;
                        }
                    }
                }

                foreach ($mergeCoordinate as $key => $coordinate) {
                    if ($key % 2 != 0) {
                        $merge = $mergeCoordinate[$key - 1] . ':' . $mergeCoordinate[$key];
                        $listMerge[] = $merge;
                    }
                }
            },
            '[[values]]' => function (CallbackParam $param) use (&$listMerge, &$listRowTs) {
                $sheet = $param->sheet;
                $row_index = $param->row_index;
                $col_index = $param->col_index;
                $cell_coordinate = $param->coordinate;
                $value = $param->param[$row_index][$col_index];
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);

                if ($value == '') {
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('5b9bd5');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);
                }

                if ($value == 'NV') {
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('c0504d');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);
                    $sheet->getCell($cell_coordinate)->setValue(null);
                }

                if ($value == 'L') {
                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('fbe4d5');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);
                }

                if ($value == 'TS') {
                    $mergeCoordinate[] = $cell_coordinate;

                    $sheet->getStyle($cell_coordinate)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('ffff00');
                    $sheet->getStyle($cell_coordinate)->getFont()->setBold(false);

                    $columnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($currentColumn);

                    $firstValue = $param->param[$row_index][$col_index];

                    if (!in_array($row_index, $listRowTs)) {
                        $listRowTs[] = $row_index;
                        for ($i = $col_index; $i < count($param->param[$row_index]); $i++) {
                            $adjustedColumnIndex = $columnIndex++;
                            if ($param->param[$row_index][$i] != $firstValue) {

                                $valueBefor = $param->param[$row_index][$i - 1];

                                if ($valueBefor == 'TS') {
                                    $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex - 1);

                                    $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                                } elseif ($param->param[$row_index][$i] == 'TS' && $valueBefor != 'TS') {
                                    $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                                    $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                                }

                                $firstValue = $param->param[$row_index][$i];
                            }

                            if ($i == count($param->param[$row_index]) - 1 && $param->param[$row_index][$i] == 'TS') {
                                $adjustedColumnBefor = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($adjustedColumnIndex);
                                $mergeCoordinate[] = $adjustedColumnBefor . $currentRow;
                            }
                        }
                    }

                    foreach ($mergeCoordinate as $key => $coordinate) {
                        if ($key % 2 != 0) {
                            $merge = $mergeCoordinate[$key - 1] . ':' . $mergeCoordinate[$key];
                            $listMerge[] = $merge;
                        }
                    }
                }
                $sheet->getColumnDimension($currentColumn)->setWidth(3);
            },
            '{note}' => function (CallbackParam $param) {
                $sheet = $param->sheet;
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $lastCol = 'AJ' . $currentRow;
                $merge = $cell_coordinate . ':' . $lastCol;

                $sheet->mergeCells($merge);

                $sheet->getRowDimension($currentRow)->setRowHeight(80);
            },
            '{work}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ':' . $mergeCol;

                $listMerge[] = $merge;
            },
            '{sign}' => function (CallbackParam $param) use (&$listMerge) {
                $cell_coordinate = $param->coordinate;
                $currentRow = preg_replace('/[A-Z]+/', '', $cell_coordinate);
                $currentColumn = preg_replace('/[0-9]+/', '', $cell_coordinate);
                $coordinateMerge = (int) $currentRow + 1;
                $mergeCol = $currentColumn . $coordinateMerge;
                $merge = $cell_coordinate . ':' . $mergeCol;

                $listMerge[] = $merge;
            },
        ];

        $events = [
            PhpExcelTemplator::AFTER_INSERT_PARAMS => function (Worksheet $sheet, array $templateVarsArr) use (&$listMerge) {
                foreach ($listMerge as $item) {
                    $sheet->mergeCells($item);
                }
                $sheet->mergeCells('A1:AJ2');
            },

        ];

        return $this->excelExporterServices->export('timekeeping_report', $params, $callbacks, $events);
    }

    public function calculatorManualCalcualtion($employee, $startDate, $endDate, $responseTimeKeepingUser)
    {
        $manualCalculation = $employee->manualCalculation()->where('Date', '>=', $startDate)->where('Date', '<=', $endDate)->get();

        foreach ($manualCalculation as $value) {
            $date = Carbon::parse($value->Date);

            $check = Carbon::parse($date->format('Y-m-d'))->setTimezone('GMT+7')->format('l');

            if ($check === 'Saturday' || $check === 'Sunday') {
                $timekeepingReport = 0;
            } else {
                $timekeepingReport = 1;
            }

            switch ($value->Type) {
                case '1':
                    $type = 'X';
                    break;
                case '2':
                    $type = 'K';
                    break;
                case '3':
                    $type = 'F';
                    break;
            }

            foreach ($responseTimeKeepingUser as $key => $valueUser) {

                if ($valueUser['type'] == 'KXD' && $date->format('Y-m-d') == $valueUser['date']) {
                    unset($responseTimeKeepingUser[$key]);
                    $responseTimeKeepingUser[$key] = [
                        'date' => $date->format('Y-m-d'),
                        'timekeepingReport' => $timekeepingReport,
                        'type' => $type,
                    ];
                }
            }
        }

        return $responseTimeKeepingUser;
    }
}
