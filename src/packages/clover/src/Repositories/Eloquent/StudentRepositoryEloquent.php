<?php

namespace GGPHP\Clover\Repositories\Eloquent;

use Carbon\Carbon;
use DateTime;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Presenters\StudentPresenter;
use GGPHP\Clover\Repositories\Contracts\StudentRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Models\OldStudentTuition;
use GGPHP\Refund\Models\Refund;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class StudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class StudentRepositoryEloquent extends CoreRepositoryEloquent implements StudentRepository
{
    const PAYMENT_FORM = [
        'HOCKY1',
        'HOCKY2',
        'Nam',
        'HOCKY1_HOCKY2',
        'THANG'
    ];

    const FEE_STUDENT_LEAVE = ['TIENAN', 'HP', 'XEBUS'];

    const PHI_TIENAN = 'TIENAN';
    const PHI_XE_BUYT = 'BUS';
    const HINHTHUC_THANG = 'THANG';

    const STUDENT_LEAVE = 'LEAVE';
    const STUDENT_STORE = 'STORE';

    const REFUND_FORM_MONTH = 'THANG';
    const REFUND_FORM_WEEK = 'TUAN';
    const REFUND_FORM_DAY = 'NGAY';

    const FEE_STUDENT_STORE = ['XEBUS', 'TIENAN'];

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'FullName' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Student::class;
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
        return StudentPresenter::class;
    }

    public function getStudent(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('FullName', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $student = $this->paginate($attributes['limit']);
        } else {
            $student = $this->get();
        }

        return $student;
    }

    public function studentRefund(array $attributes)
    {
        $date = explode('-', $attributes['date']);

        $attributes['year'] = $date[0];
        $attributes['month'] = $date[1];

        $refund = Refund::find($attributes['refundId']);
        $attributes['schoolYearId'] = $refund->SchoolYearId;
        $attributes['startDate'] = $refund->schoolYear->StartDate;
        $attributes['endDate'] = $refund->schoolYear->EndDate;

        $students = $this->getStudentCalculatorRefund($attributes);
        foreach ($students as $key => $student) {
            $refunds = $this->calculatorRefund($student, $refund, $attributes);
            $refunds = collect($refunds)->filter(function ($item) {
                return $item['feeRefund'] != 0;
            })->toArray();

            $student->refund = $refunds;
        }

        $students = $students->filter(function ($item) {
            return !empty($item['refund']);
        });

        return $this->parserResult($students);
    }

    public function getStudentCalculatorRefund($attributes)
    {
        $students = $this->model->when($attributes['type'] == self::STUDENT_LEAVE, function ($query) use ($attributes) {
            $query->whereYear('WithdrawApplicationDate', $attributes['year']);
            $query->whereMonth('WithdrawApplicationDate', $attributes['month']);
            $query->where('Status', $this->model()::WITHDRAW_APPLICATION);
        })->when($attributes['type'] == self::STUDENT_STORE, function ($query) use ($attributes) {
            $query->whereYear('StopStudyingDate', $attributes['year']);
            $query->whereMonth('StopStudyingDate', $attributes['month']);
            $query->where('Status', $this->model()::STORE);
            $query->whereNotNull('RestoredDate');
            $query->whereColumn('RestoredDate', '>=', 'StopStudyingDate');
        })->whereHas('chargeOldStudent', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
            $query->where('PaymentStatus', '!=', ChargeOldStudent::PAYMENT_STATUS['UNPAID']);
            $query->where('SchoolYearId', $attributes['schoolYearId']);
            $query->whereHas('tuition', function ($query) use ($attributes) {
                $query->whereHas('fee', function ($query) use ($attributes) {
                    $query->when($attributes['type'] == self::STUDENT_STORE, function ($query) {
                        return $query->whereIn('Type', self::FEE_STUDENT_STORE);
                    }, function ($query) {
                        return $query->whereIn('Type', self::FEE_STUDENT_LEAVE);
                    });
                });
                $query->whereHas('paymentForm', function ($query) {
                    $query->whereIn('Code', self::PAYMENT_FORM);
                });
            });
            $query->has('detailPaymentAccountant');
        })->whereHas('attendance', function ($query) use ($attributes) {
            $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
        })->with([
            'chargeOldStudent' => function ($query) use ($attributes) {
                $query->where('BranchId', $attributes['branchId']);
                $query->where('PaymentStatus', '!=', ChargeOldStudent::PAYMENT_STATUS['UNPAID']);
                $query->where('SchoolYearId', $attributes['schoolYearId']);
                $query->with([
                    'detailPaymentAccountant',
                    'tuition' => function ($query) use ($attributes) {
                        $query->whereHas('fee', function ($query) use ($attributes) {
                            $query->when($attributes['type'] == self::STUDENT_STORE, function ($query) {
                                return $query->whereIn('Type', self::FEE_STUDENT_STORE);
                            }, function ($query) {
                                return $query->whereIn('Type', self::FEE_STUDENT_LEAVE);
                            });
                        });
                        $query->whereHas('paymentForm', function ($query) {
                            $query->whereIn('Code', self::PAYMENT_FORM);
                        });
                    }
                ]);
            },
            'attendance' => function ($query) use ($attributes) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            }
        ])->get();

        return $students;
    }

    public function calculatorRefund(Student $student, Refund $refund, array $attributes)
    {
        $chargeOldStudent = $student->chargeOldStudent->first();

        $detailPayment = $chargeOldStudent->detailPaymentAccountant; // danh sách các loại phí đã đóng tiền trong năm học

        $tuitions = $chargeOldStudent->tuition()->whereIn('FeeId', $detailPayment->pluck('FeeId')->toArray())->get(); // lấy các loại phí đã đóng tiền

        $detailRefund = $refund->refundDetail;

        if ($attributes['type'] == self::STUDENT_LEAVE) {
            $objectRefund = $this->refundStudentLeave($tuitions, $detailRefund, $student, $detailPayment, $attributes);
        }

        if ($attributes['type'] == self::STUDENT_STORE) {
            $objectRefund = $this->refundStudentStore($tuitions, $detailRefund, $student, $detailPayment, $attributes);
        }

        return $objectRefund ?? [];
    }

    public function refundStudentLeave($tuitions, $detailRefund, $student, $detailPayment, $attributes)
    {
        $objectRefund = [];

        $dateWithdraw = $student->WithdrawApplicationDate;
        $student->dateOff = $dateWithdraw;
        $tuitions->each(function ($item) use (&$objectRefund, $detailRefund, $student, $detailPayment, $attributes, $dateWithdraw) {
            $configDetailApply = $detailRefund->where('FeeId', $item->FeeId)->where('StartDate', '<=', $dateWithdraw)
                ->where('EndDate', '>=', $dateWithdraw)->first();
            if (is_null($configDetailApply)) {
                return true;
            }

            $feePaid = $detailPayment->where('FeeId', $item->FeeId);
            if ($feePaid->isEmpty()) {
                return true;
            }

            $listMonthStudied = $this->monthStudied($student, $attributes);

            $feeOnMonth = $this->feeOnMonth($item);

            $feeStudiedByMonth = $feeOnMonth * ($listMonthStudied->count());

            $totalFeePaid = $feePaid->sum('Money');

            $configRefundDetail = $configDetailApply->configRefund()->where('Type', $attributes['type'])->first();

            $lastMonth = $listMonthStudied->sortDesc()->first();

            switch ($configRefundDetail->RefundForm) {
                case self::REFUND_FORM_MONTH:
                    $feeRefund = $totalFeePaid - $feeStudiedByMonth;

                    $objectRefund[] = [
                        'feeId' => $item->FeeId,
                        'feeRefund' => (float) $feeRefund,
                        'feeName' => $item->fee->Name,
                        'feePaid' =>  $totalFeePaid,
                        'feeStudied' => $feeStudiedByMonth
                    ];
                    break;

                case self::REFUND_FORM_WEEK:
                    $lastDateStudy = $student->attendance()->whereDate('Date', '>=', $attributes['startDate'])
                        ->whereDate('Date', '<=', $attributes['endDate'])->orderBy('Date', 'Desc')->first();

                    $lastWeekStudy = $lastDateStudy->Date->endOfweek();

                    if ($lastWeekStudy->isAfter($configDetailApply->EndDate)) {
                        $lastWeekStudy = Carbon::parse($configDetailApply->EndDate);
                    }

                    $lastDayInMonth = $lastWeekStudy->copy()->endOfMonth();
                    $weekNotStudy = $lastDayInMonth->endOfMonth()->diffInWeeks($lastWeekStudy);
                    $numberWeekInMonth = Carbon::parse($lastMonth)->endOfMonth()->weekNumberInMonth;

                    $feeNotStudyByWeek = $feeOnMonth * $weekNotStudy / $numberWeekInMonth;

                    $realFeeStudied =  $feeStudiedByMonth - $feeNotStudyByWeek;

                    $feeRefund = $totalFeePaid - $realFeeStudied;

                    $objectRefund[] = [
                        'feeId' => $item->FeeId,
                        'feeRefund' => (float) $feeRefund,
                        'feeName' => $item->fee->Name,
                        'feePaid' =>  $totalFeePaid,
                        'feeStudied' => $realFeeStudied
                    ];
                    break;
            }
        });

        return $objectRefund;
    }

    public function refundStudentStore($tuitions, $detailRefund, $student, $detailPayment, $attributes)
    {
        $objectRefund = [];

        $stopStudyingDate = $student->StopStudyingDate;
        $restoredDate = $student->RestoredDate;

        $holidays = $this->holidays($student->StopStudyingDate, $student->RestoredDate);
        $dayOff = Carbon::parse($restoredDate)->diffInDays($stopStudyingDate) - $holidays;

        $student->dateOff = $stopStudyingDate;
        $student->numberDayOff = $dayOff;

        $tuitions->each(function ($item) use (&$objectRefund, $detailRefund, $student, $detailPayment, $attributes, $stopStudyingDate, $dayOff, $restoredDate) {
            $configDetailApply = $detailRefund->where('FeeId', $item->FeeId)->where('StartDate', '<=', $stopStudyingDate)
                ->where('EndDate', '>=', $stopStudyingDate)->first();

            if (is_null($configDetailApply)) {
                return true;
            }

            $feePaid = $detailPayment->where('FeeId', $item->FeeId);
            if ($feePaid->isEmpty()) {
                return true;
            }

            $listMonthStudied = $this->monthStudied($student);

            $feeOnMonth = $this->feeOnMonth($item);

            $totalFeePaid = $feePaid->sum('Money');

            $configRefundDetail = $configDetailApply->configRefund()->where('Type', $attributes['type'])->first();

            $lastMonth = $listMonthStudied->sortDesc()->first();

            $restoredDateByWeek = Carbon::parse($restoredDate)->endOfWeek();
            $endDateApply = Carbon::parse($restoredDateByWeek)->isAfter($configDetailApply->EndDate) ? $configDetailApply->EndDate : $restoredDateByWeek;

            $dayEndWeek = Carbon::parse($stopStudyingDate)->endOfWeek()->format('Y-m-d');

            switch ($configRefundDetail->RefundForm) {
                case self::REFUND_FORM_MONTH:
                    $monthNotStudy = Carbon::parse($endDateApply)->diffInMonths($stopStudyingDate);

                    $feeRefund = $feeOnMonth * $monthNotStudy;

                    $feeStudiedByMonth = $feeOnMonth * ($listMonthStudied->count());

                    $objectRefund[] = [
                        'feeId' => $item->FeeId,
                        'feeRefund' => (float) $feeRefund,
                        'feeName' => $item->fee->Name,
                        'feePaid' =>  $totalFeePaid,
                        'feeStudied' => $feeStudiedByMonth
                    ];
                    break;
                case self::REFUND_FORM_WEEK:
                    $feeOnWeek = $this->feeOnWeek($feeOnMonth, $lastMonth);

                    $weekNotStudy = Carbon::parse($endDateApply)->diffInWeeks($dayEndWeek);

                    $feeRefund = $feeOnWeek * $weekNotStudy;

                    $firstDayInSchoolYear = $student->attendance()->whereDate('Date', '>=', $attributes['startDate'])
                        ->whereDate('Date', '<=', $attributes['endDate'])
                        ->oldest('Date')->limit(1)->first()->Date;

                    $lastDayInSchoolYear = $student->attendance()->whereDate('Date', '>=', $attributes['startDate'])
                        ->whereDate('Date', '<=', $attributes['endDate'])->latest('Date')->limit(1)->first()->Date;

                    $lastWeekStudied = $lastDayInSchoolYear->endOfWeek();

                    $numberWeekStudied = $lastWeekStudied->diffInWeeks($firstDayInSchoolYear->endOfWeek());
                    $feeStudiedByWeek = $feeOnWeek * $numberWeekStudied;

                    $objectRefund[] = [
                        'feeId' => $item->FeeId,
                        'feeRefund' => (float) $feeRefund,
                        'feeName' => $item->fee->Name,
                        'feePaid' =>  $totalFeePaid,
                        'feeStudied' => $feeStudiedByWeek
                    ];

                    break;
                case self::REFUND_FORM_DAY:
                    $feeOnDay = $this->feeOnDay($feeOnMonth, $lastMonth);

                    $feeRefund = $feeOnDay * $dayOff;
                    $numberDayStudied = $student->attendance()->whereDate('Date', '>=', $attributes['startDate'])
                        ->whereDate('Date', '<=', $attributes['endDate'])->count();
                    $feeStudiedByDay = $feeOnDay * $numberDayStudied;

                    $objectRefund[] = [
                        'feeId' => $item->FeeId,
                        'feeRefund' => (float) $feeRefund,
                        'feeName' => $item->fee->Name,
                        'feePaid' =>  $totalFeePaid,
                        'feeStudied' => $feeStudiedByDay
                    ];
                    break;
            }
        });

        return $objectRefund;
    }

    public function monthStudied(Student $student, array $attributes = [])
    {
        if (empty($attributes)) {
            $schoolYear = $student->chargeOldStudent->first()->schoolYear;
            $list = $student->attendance()->whereDate('Date', '>=', $schoolYear->StartDate)->whereDate('Date', '<=', $schoolYear->EndDate)->get();
        } else {
            $list = $student->attendance;
        }

        $list = $list->groupBy(function ($item) {
            $date = Carbon::parse($item->Date)->format('Y-m');
            return $date;
        })->map(function ($item, $key) {
            return $key;
        })->flatten()->sort();

        return $list;
    }

    public function feeOnMonth(OldStudentTuition $oldStudentTuition): float
    {
        $expectedToCollectMoney = collect($oldStudentTuition->chargeOldStudent->ExpectedToCollectMoney);

        $filterExpectedMoney = $expectedToCollectMoney->filter(function ($item) use ($oldStudentTuition) {
            $dayAdmission = Carbon::parse($oldStudentTuition->chargeOldStudent->DayAdmission)->format('Y-m');

            return $item['month'] >= $dayAdmission;
        })->map(function ($item) {
            return $item['fee'];
        });

        $countMonth = $filterExpectedMoney->count();

        $totalByFee = $filterExpectedMoney->flatten(1)->sum(function ($item) use ($oldStudentTuition) {
            return $item['fee_id'] == $oldStudentTuition->FeeId ? $item['money'] : 0;
        });

        $feeOnMonth = $totalByFee / $countMonth;

        return $feeOnMonth;
    }

    public function feeOnWeek($feeOnMonth, $month)
    {
        $numberWeek = Carbon::parse($month)->endOfMonth()->weekNumberInMonth;

        return $feeOnMonth / $numberWeek;
    }

    public function feeOnDay(int $feeOnMonth, $month): float
    {
        $startDate = Carbon::parse($month)->startOfMonth()->format('Y-m-d');
        $endDate = Carbon::parse($month)->endOfMonth();
        $holidays  = $this->holidays($startDate, $endDate->format('Y-m-d'));
        $daysInMonth = $endDate->daysInMonth;
        $dayStudy = $daysInMonth - $holidays;

        return $feeOnMonth / $dayStudy;
    }

    public function holidays($month = null, $nextMonth): int
    {
        if ($month === null) $month = Carbon::today()->startOfMonth();

        $month = Carbon::parse($month);

        $nextMonth = Carbon::parse($nextMonth);

        $dayHoliday = 0;

        if ($nextMonth->isSunday() || $nextMonth->isSaturday()) {
            $dayHoliday = 1;
        }

        return $month->diffInDaysFiltered(function ($date) {
            return $date->isSunday() || $date->isSaturday();
        }, $nextMonth) + $dayHoliday;
    }
}
