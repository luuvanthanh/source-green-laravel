<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use DateInterval;
use DatePeriod;
use DateTime;
use Exception;
use GGPHP\Category\Models\Holiday;
use GGPHP\Category\Models\HolidayDetail;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChangeParameterDetail;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Models\FeeDetail;
use GGPHP\Fee\Models\FeePolicie;
use GGPHP\Fee\Models\MoneyBus;
use GGPHP\Fee\Models\MoneyMeal;
use GGPHP\Fee\Models\PaymentForm;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Fee\Presenters\FeePoliciePresenter;
use GGPHP\Fee\Repositories\Contracts\FeePolicieRepository;
use Hamcrest\Type\IsInteger;
use Illuminate\Support\Facades\DB;
use PHPUnit\Util\Json;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class FeePolicieRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FeePolicieRepositoryEloquent extends CoreRepositoryEloquent implements FeePolicieRepository
{
    const SEMESTER1 = 'HOCKY1';
    const SEMESTER2 = 'HOCKY2';
    const SEMESTER1_SEMESTER2 = 'HOCKY1_HOCKY2';
    const YEAR = 'NAM';
    const MONTH = 'THANG';
    const TUITION_FEE = 'HP';
    const MEAL_FEE = 'TIENAN';
    const BUS_FEE = 'XEBUS';
    const OTHER = 'KHAC';
    const FIRSTWEEK = 'D';
    const WEEKEND = 'WEEKEND';
    const MIDDLEWEEK = 'G';

    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return FeePolicie::class;
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
        return FeePoliciePresenter::class;
    }

    public function filterFeePolicie(array $attributes)
    {
        if (!empty($attributes['feePolicieCrm'])) {
            $this->model = $this->model->where('FeePolicieCrmId', null);
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model->whereIn('BranchId', explode(',', $attributes('branchId')));
        }

        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where('YearFrom', '>=', $attributes['from'])->where('YearTo', '<=', $attributes['to']);
            });
        }

        if (!empty($attributes['limit'])) {
            $feePolicie = $this->paginate($attributes['limit']);
        } else {
            $feePolicie = $this->get();
        }

        return $feePolicie;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $feePolicie = FeePolicie::create($attributes);

            if (!empty($attributes['feeDetail'])) {
                foreach ($attributes['feeDetail'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->feeDetail()->create($value);
                }
            }

            if (!empty($attributes['moneyMeal'])) {
                foreach ($attributes['moneyMeal'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->moneyMeal()->create($value);
                }
            }

            if (!empty($attributes['otherMoneyDetail'])) {
                foreach ($attributes['otherMoneyDetail'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->otherMoneyDetail()->create($value);
                }
            }

            if (!empty($attributes['moneyBus'])) {
                foreach ($attributes['moneyBus'] as $value) {
                    $value['FeePoliceId'] = $feePolicie->Id;
                    MoneyBus::create($value);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($feePolicie->Id);
    }

    public function update(array $attributes, $id)
    {
        $feePolicie = FeePolicie::findOrFail($id);

        DB::beginTransaction();
        try {

            $feePolicie->update($attributes);

            if (!empty($attributes['feeDetail'])) {
                $feePolicie->feeDetail()->delete();

                foreach ($attributes['feeDetail'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->feeDetail()->create($value);
                }
            }

            if (!empty($attributes['moneyMeal'])) {
                $feePolicie->moneyMeal()->delete();

                foreach ($attributes['moneyMeal'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->moneyMeal()->create($value);
                }
            }

            if (!empty($attributes['otherMoneyDetail'])) {
                $feePolicie->otherMoneyDetail()->delete();

                foreach ($attributes['otherMoneyDetail'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $feePolicie->otherMoneyDetail()->create($value);
                }
            }

            if (!empty($attributes['moneyBus'])) {
                $feePolicie->moneyBus()->delete();

                foreach ($attributes['moneyBus'] as $value) {
                    $value['FeePoliceId'] = $feePolicie->Id;
                    MoneyBus::create($value);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($feePolicie->Id);
    }

    public function moneyFeePolicies(array $attributes, $isInternal = false)
    {
        $details = json_decode($attributes['details']);
        $data = [];
        $feePolicie = FeePolicie::where('BranchId', $attributes['branchId'])->where('SchoolYearId', $attributes['schoolYearId'])->first();

        if (is_null($feePolicie)) {
            throw new HttpException(400, 'Chưa hoàn thành cấu hình Chính sách phí.');
        }

        $schoolYear = SchoolYear::findOrFail($attributes['schoolYearId']);
        $listMonthAge = resolve(ChargeOldStudentRepositoryEloquent::class)->getMonthAgeDetailStudent($attributes);

        foreach ($details as $key => $detail) {
            $fee = Fee::findOrFail($detail->feeId);
            $paymentForm = PaymentForm::findOrFail($detail->paymentFormId);
            $dayAdmission = isset($detail->applyDate) ? $detail->applyDate : $attributes['dayAdmission'];

            if ($attributes['dayAdmission'] <= $schoolYear->StartDate) {
                $dayAdmission = $schoolYear->StartDate;
            }

            $totalMonth = $schoolYear->TotalMonth;
            $weekDayAdmission = $schoolYear->timetable()->whereDate('StartDate', '<=', $dayAdmission)->whereDate('EndDate', '>=', $dayAdmission)->first();
            $money = 0;
            $result = 0;
            $moneyMonth = 0;

            if (!is_null($weekDayAdmission)) {
                $endMonth = Carbon::parse($weekDayAdmission->EndDate)->endOfMonth();

                $timetable = $schoolYear->timetable->where('Month', $weekDayAdmission->Month);

                $month = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                    ->where('StartDate', '<=', $dayAdmission)->where('EndDate', '>=', $dayAdmission)->first();
                $totalWeekStudyInMonth = count($timetable);

                if (!is_null($weekDayAdmission)) {
                    $remainingWeek = $totalWeekStudyInMonth - $weekDayAdmission->Week + 1;
                } else {
                    $remainingWeek = 1;
                }

                $monthAdmission = Carbon::parse($dayAdmission)->floorMonth();
                $daysLeftInMonth = $endMonth->diffInDays($dayAdmission) + 1;
                $totalDayWeekend = $this->countWeekend($dayAdmission, $endMonth->format('Y-m-d'));
                $dayAdmissionCarbon = Carbon::parse($dayAdmission);

                $getEndDate = $schoolYear->changeParameter->changeParameterDetail()->whereMonth('Date', $dayAdmissionCarbon->format('m'))->whereYear('Date', $dayAdmissionCarbon->format('Y'))->first();
                $begin = new DateTime($dayAdmission);

                $end = new DateTime($getEndDate->EndDate);
                switch ($fee->Type) {
                    case self::TUITION_FEE:
                        $feeDetail = $feePolicie->feeDetail()
                            ->where('ClassTypeId', $attributes['classTypeId'])
                            ->where('PaymentFormId', $detail->paymentFormId)->first();

                        $getFirstFeeDetail = $feePolicie->feeDetail()
                            ->whereIn('ClassTypeId', $listMonthAge['countClassType'])
                            ->where('PaymentFormId', $detail->paymentFormId)->get();
                        $years = $schoolYear->changeParameter->changeParameterDetail()->where('StartDate', '>=', $dayAdmission)->orWhere('EndDate', '>=', $dayAdmission)->get();
                        $arrOfDate = $this->getAllDay($years);

                        switch ($paymentForm->Code) {
                            case self::SEMESTER1:
                                $countSemester1 = $schoolYear->changeParameter->changeParameterDetail()->whereHas('paymentForm', function ($query) {
                                    $query->where('Code', self::SEMESTER1);
                                })->get();

                                $countSemester2 = $schoolYear->changeParameter->changeParameterDetail()->whereHas('paymentForm', function ($query) {
                                    $query->where('Code', self::SEMESTER2);
                                })->get();
                                $paymentFormSemester1Id = array_unique(array_column($countSemester1->ToArray(), 'PaymentFormId'))[0];
                                $paymentFormSemester2Id = array_unique(array_column($countSemester2->ToArray(), 'PaymentFormId'))[0];

                                foreach ($listMonthAge['detailStudent'] as $key => $value) {
                                    $schoolYearDay = $schoolYear->changeParameter->changeParameterDetail()->where('Date', $value['date'])->first();
                                    $listMonthAge['detailStudent'][$key]['paymentFormId'] = $schoolYearDay->PaymentFormId;

                                    $feeDetail = $feePolicie->feeDetail()
                                        ->where('ClassTypeId', $value['classTypeId'])
                                        ->where('PaymentFormId', $schoolYearDay->PaymentFormId)->first();

                                    $listMonthAge['detailStudent'][$key]['money'] = $feeDetail->OldStudent;
                                    $value['money'] = $feeDetail->OldStudent;
                                    $value['paymentFormId'] = $schoolYearDay->PaymentFormId;

                                    if (in_array($paymentFormSemester1Id, $value)) {
                                        $listMonthAge['detailStudent'][$key]['count'] = $countSemester1->count();
                                        $value['count'] = $countSemester1->count();
                                    }

                                    if (in_array($paymentFormSemester2Id, $value)) {
                                        $listMonthAge['detailStudent'][$key]['count'] = $countSemester2->count();
                                        $value['count'] = $countSemester2->count();
                                    }

                                    $listMonthAge['detailStudent'][$key]['total'] = $value['money'] / $value['count'];
                                }

                                $x = [];
                                if ($dayAdmission <= $schoolYear->StartDate) {
                                    foreach ($listMonthAge['detailStudent'] as $key => $value) {
                                        if ($paymentFormSemester1Id == $value['paymentFormId']) {
                                            $x[] = $value;
                                        }
                                    }
                                    $sumSemester1 = array_column($x, 'total');
                                    $result = array_sum($sumSemester1);
                                } else {
                                    $result = 0;
                                }

                                break;
                            case self::SEMESTER2:

                                $countSemester1 = $schoolYear->changeParameter->changeParameterDetail()->whereHas('paymentForm', function ($query) {
                                    $query->where('Code', self::SEMESTER1);
                                })->get();

                                $countSemester2 = $schoolYear->changeParameter->changeParameterDetail()->whereHas('paymentForm', function ($query) {
                                    $query->where('Code', self::SEMESTER2);
                                })->get();
                                $paymentFormSemester1Id = array_unique(array_column($countSemester1->ToArray(), 'PaymentFormId'))[0];
                                $paymentFormSemester2Id = array_unique(array_column($countSemester2->ToArray(), 'PaymentFormId'))[0];

                                foreach ($listMonthAge['detailStudent'] as $key => $value) {
                                    $schoolYearDay = $schoolYear->changeParameter->changeParameterDetail()->where('Date', $value['date'])->first();
                                    $listMonthAge['detailStudent'][$key]['paymentFormId'] = $schoolYearDay->PaymentFormId;

                                    $feeDetail = $feePolicie->feeDetail()
                                        ->where('ClassTypeId', $value['classTypeId'])
                                        ->where('PaymentFormId', $schoolYearDay->PaymentFormId)->first();

                                    $listMonthAge['detailStudent'][$key]['money'] = $feeDetail->OldStudent;
                                    $value['money'] = $feeDetail->OldStudent;
                                    $value['paymentFormId'] = $schoolYearDay->PaymentFormId;

                                    if (in_array($paymentFormSemester1Id, $value)) {
                                        $listMonthAge['detailStudent'][$key]['count'] = $countSemester1->count();
                                        $value['count'] = $countSemester1->count();
                                    }

                                    if (in_array($paymentFormSemester2Id, $value)) {
                                        $listMonthAge['detailStudent'][$key]['count'] = $countSemester2->count();
                                        $value['count'] = $countSemester2->count();
                                    }

                                    $listMonthAge['detailStudent'][$key]['total'] = $value['money'] / $value['count'];
                                }

                                $y = [];

                                if ($dayAdmission <= $schoolYear->StartDate) {
                                    foreach ($listMonthAge['detailStudent'] as $key => $valueStudent) {

                                        if ($paymentFormSemester2Id == $valueStudent['paymentFormId']) {
                                            $y[] = $valueStudent;
                                        }
                                    }
                                    $sumSemester2 = array_column($y, 'total');
                                    $result = array_sum($sumSemester2);
                                } else {
                                    $result = 0;
                                }
                                break;
                            case self::YEAR:
                                $totalMonthSemester2 = array_sum(array_column($schoolYear->changeParameter->changeParameterDetail->ToArray(), 'FullMonth'));

                                foreach ($schoolYear->changeParameter->changeParameterDetail as $key => $year) {
                                    $classTypeId = $listMonthAge['detailStudent'][$year->StartDate]['classTypeId'];
                                    $sumFullMonth[$classTypeId][] = $year->FullMonth;
                                }

                                foreach ($sumFullMonth as $key => $value) {
                                    $sumClassTypeId[$key] = array_sum($sumFullMonth[$key]);
                                }

                                foreach ($years as $key => $year) {
                                    $classTypeIdByAge = $listMonthAge['detailStudent'][$year->StartDate]['classTypeId'];
                                    $feeDetail = $feePolicie->feeDetail()->where('ClassTypeId', $classTypeIdByAge)
                                        ->where('PaymentFormId', $detail->paymentFormId)->first();

                                    switch ($attributes['student']) {
                                        case 'new':
                                            $money = $feeDetail->NewStudent;
                                            break;
                                        case 'old':
                                            $money = $feeDetail->OldStudent;
                                            break;
                                    }
                                    $listMonthAge['detailStudent'][$year->Date]['fullMonth'] = $year->FullMonth;

                                    $countClass[$feeDetail->ClassTypeId][] = count($listMonthAge[$feeDetail->ClassTypeId]);
                                    $numberOfMonth = count($listMonthAge[$feeDetail->ClassTypeId]);
                                    $agv = ((($money * $sumClassTypeId[$feeDetail->ClassTypeId]) / $totalMonthSemester2)) / $numberOfMonth;
                                    $checkWeekend = !empty($arrOfDate[$dayAdmission]['numberOfWeek']) ? $arrOfDate[$dayAdmission]['numberOfWeek'] : $arrOfDate[$dayAdmission] - 1;

                                    if ($key == 0) {
                                        $sumTuition[] = $agv * ($year->ActualWeek - $checkWeekend) / $year->ActualWeek;
                                    } else {
                                        $sumTuition[] = $agv;
                                    }
                                }

                                if ($dayAdmissionCarbon->format('Y-m-d') <= $schoolYear->StartDate) {
                                    $result = array_sum($sumTuition);
                                } else {
                                    $result = array_sum(($sumTuition));
                                }

                                break;
                            case self::MONTH:
                                foreach ($listMonthAge['detailStudent'] as $key1 => $valueMonthAge) {
                                    $query = $feePolicie->feeDetail()->where('PaymentFormId', $detail->paymentFormId)->where('ClassTypeId', $valueMonthAge['classTypeId'])->get();
                                    $getMoney = $this->getMoneyByDate($query->ToArray(), $attributes);
                                    $money = !empty($getMoney[$valueMonthAge['month']]) ? $getMoney[$valueMonthAge['month']] : 0;
                                    $setDate = $listMonthAge['detailStudent'][$valueMonthAge['month']]['date'];
                                    $listMonthAge['detailStudent'][$valueMonthAge['month']]['money'] = $money;
                                    $listMonthAge['detailMoney'][$setDate] = $money;
                                }

                                if ($dayAdmission == $schoolYear->StartDate) {

                                    $getMoney = $listMonthAge['detailStudent'][$schoolYear->StartDate]['money'];
                                    $result = $getMoney;
                                    $moneyMonth = $getMoney;
                                } else {
                                    $checkWeekend = !empty($arrOfDate[$dayAdmission]['numberOfWeek']) ? $arrOfDate[$dayAdmission]['numberOfWeek'] : $arrOfDate[$dayAdmission] - 1;
                                    $setDay = $dayAdmissionCarbon->day(1)->format('Y-m-d');
                                    $moneyFirstMonth = $listMonthAge['detailMoney'][$setDay];
                                    $firstMonth = $schoolYear->changeParameter->changeParameterDetail()->whereMonth('Date', $dayAdmissionCarbon->format('m'))->first();
                                    $money = $moneyFirstMonth * ($firstMonth->ActualWeek - $checkWeekend) / $firstMonth->ActualWeek;
                                    $result = $money;
                                    $moneyMonth = $money;
                                }

                                break;
                        }

                        break;
                    case self::MEAL_FEE:
                        $getFirstFeeDetail = $feePolicie->moneyMeal()
                            ->where('ClassTypeId', $listMonthAge['countClassType'][0])
                            ->where('PaymentFormId', $detail->paymentFormId)->first();

                        foreach ($listMonthAge['detailStudent'] as $key => $valueMonthAge) {
                            $feeDetail = $feePolicie->moneyMeal()
                                ->where('ClassTypeId', $valueMonthAge['classTypeId'])
                                ->whereHas('paymentForm', function ($q) {
                                    $q->where('Code', PaymentForm::CODE['THANG']);
                                })->first();

                            $listMonthAge['detailStudent'][$key]['money'] = $feeDetail->Money;
                            $listMonthAge['replaceDetailStudent'][$valueMonthAge['date']]['money'] = $feeDetail->Money;
                        }

                        $arrDate = $this->getDatesFromRange($begin->format('Y-m-d'), $end->format('Y-m-d'));

                        $totalDaySemester1 = 0;
                        foreach ($arrDate as $key => $value) {

                            if ($this->isWeekend($value)) {
                                unset($arrDate[$key]);
                            }

                            $date = new DateTime($value);
                            $holiday = Holiday::whereIn('Name', [$schoolYear->YearFrom, $schoolYear->YearTo])->get();

                            $arrHoliday = [];
                            foreach ($holiday as $key => $valueHoliday) {
                                foreach ($valueHoliday->holidayDetail as $key => $valueHolidayDetail) {
                                    $arrHoliday[] = $this->getDatesFromRange($valueHolidayDetail->StartDate, $valueHolidayDetail->EndDate);
                                }
                            }

                            $holidayDate = $this->flatten($arrHoliday);
                        }
                        $totalDaySemester1 = count(array_diff($arrDate, $holidayDate));

                        if (!is_null($feeDetail)) {
                            $money = !is_null($getFirstFeeDetail) ? $getFirstFeeDetail->Money : 0;

                            switch ($paymentForm->Code) {
                                case self::SEMESTER1:
                                    $isMonth = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                                        ->where('PaymentFormId', $detail->paymentFormId)
                                        ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                        ->first();

                                    if (is_null($isMonth)) {
                                        break;
                                    }

                                    // tháng còn lại học kỳ 1
                                    $monthSemesterLeft1 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                                        ->whereHas('paymentForm', function ($query) use ($month) {
                                            $query->where('Code', self::SEMESTER1);
                                            $query->where('Date', '!=', $month->Date);
                                            $query->where('StartDate', '>', $month->EndDate);
                                        })->get();

                                    $sumSemesterLeft1 = 0;
                                    foreach ($monthSemesterLeft1 as $key => $valueSemester1) {
                                        $sumSemesterLeft1 += $listMonthAge['detailStudent'][$valueSemester1->Date]['money'] * $valueSemester1->SchoolDay;
                                    }
                                    $result = $money * $totalDaySemester1 + $sumSemesterLeft1;
                                    break;
                                case self::SEMESTER2:
                                    $isMonth = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                                        ->where('PaymentFormId', $detail->paymentFormId)
                                        ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                        ->first();

                                    if (is_null($isMonth)) {
                                        break;
                                    }

                                    // tháng còn lại học kỳ 2
                                    $monthSemesterLeft2 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                                        ->whereHas('paymentForm', function ($query) use ($month) {
                                            $query->where('Code', self::SEMESTER2);
                                            $query->where('Date', '!=', $month->Date);
                                            $query->where('StartDate', '>', $month->EndDate);
                                        })->get();

                                    $sumSemesterLeft1 = 0;
                                    foreach ($monthSemesterLeft2 as $key => $valueSemester2) {
                                        $sumSemesterLeft1 += $listMonthAge['detailStudent'][$valueSemester2->Date]['money'] * $valueSemester2->SchoolDay;
                                    }

                                    $result = $listMonthAge['detailStudent'][$month->Date]['money'] * $totalDaySemester1 + $sumSemesterLeft1;
                                    break;
                                case self::YEAR:
                                    $sumTotalYear = 0;
                                    foreach ($listMonthAge['detailStudent'] as $key => $value) {
                                        $feeDetail = $feePolicie->moneyMeal()
                                            ->where('ClassTypeId', $value['classTypeId'])
                                            ->whereHas('paymentForm', function ($q) use ($paymentForm) {
                                                $q->where('Code', $paymentForm->Code);
                                            })->first();

                                        $schoolDay = $schoolYear->changeParameter->changeParameterDetail->where('Date', $value['date'])->first();
                                        $sumTotalYear += $feeDetail->Money * $schoolDay->SchoolDay;
                                    }

                                    if ($dayAdmission <= $schoolYear->StartDate) {
                                        $result = $sumTotalYear;
                                    } else {

                                        foreach ($listMonthAge['detailStudent'] as $key => $value) {
                                            $feeDetail = $feePolicie->moneyMeal()
                                                ->where('ClassTypeId', $value['classTypeId'])
                                                ->whereHas('paymentForm', function ($q) use ($paymentForm) {
                                                    $q->where('Code', $paymentForm->Code);
                                                })->first();

                                            $schoolDay = $schoolYear->changeParameter->changeParameterDetail->where('Date', $value['date'])->first();

                                            if ($dayAdmissionCarbon->day(1)->format('Y-m-d') === $value['date']) {
                                                $listMonthAge['replaceDetailStudent'][$value['date']]['money'] = $feeDetail->Money * $totalDaySemester1;
                                            } elseif ($dayAdmissionCarbon->format('Y-m-d') > $value['date']) {
                                                $listMonthAge['replaceDetailStudent'][$value['date']]['money'] = 0;
                                            } else {
                                                $listMonthAge['replaceDetailStudent'][$value['date']]['money'] = $feeDetail->Money * $schoolDay->SchoolDay;
                                            }
                                        }

                                        $result = array_sum(array_column($listMonthAge['replaceDetailStudent'], 'money'));
                                    }

                                    break;
                                case self::MONTH:
                                    $result = $totalDaySemester1 * $listMonthAge['replaceDetailStudent'][$month->Date]['money'];
                                    $moneyMonth = $money;
                                    break;
                            }
                        }
                        break;
                    case self::OTHER:
                        $feeDetail = $feePolicie->otherMoneyDetail()
                            ->where('ClassTypeId', $attributes['classTypeId'])
                            ->where('FeeId', $detail->feeId)
                            ->where('PaymentFormId', $detail->paymentFormId)->first();
                        if (!is_null($feeDetail)) {
                            $money = $feeDetail->Money;
                            $result = $money;

                            switch ($paymentForm->Code) {
                                case self::MONTH:
                                    $moneyMonth = $result;
                                    break;
                            }
                            break;
                        }
                        break;
                    case self::BUS_FEE:
                        if (isset($detail->money)) {
                            $result = $detail->money;
                            switch ($paymentForm->Code) {
                                case self::MONTH:
                                    $moneyMonth = $result;
                                    break;
                            }
                            break;
                        }
                }
            }

            $result = [
                'id' => isset($detail->id) ? $detail->id : null,
                'feeId' => $detail->feeId,
                'paymentFormId' => $detail->paymentFormId,
                'money' => $result,
                'moneyMonth' => $moneyMonth,
                'applyDate' => $attributes['dayAdmission']
            ];

            if ($isInternal) {
                return $result;
            }

            $data[] = $result;
        }

        $detailData = $this->expectedToCollectMoney($attributes, $schoolYear, $data, $feePolicie, $listMonthAge);

        return [
            'data' => $data,
            'detailData' => $detailData,
        ];
    }

    public function countWeekend($startDate, $endDate)
    {

        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate . '23:59');
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($start, $interval, $end);

        $totalWeekend = 0;
        foreach ($dateRange as $date) {
            $check = $date->format('l');
            if ($check === 'Saturday' || $check === 'Sunday') {
                $totalWeekend += 1;
            }
        }

        return $totalWeekend;
    }

    public function updateFeePolicieCrm(array $attributes)
    {
        foreach ($attributes as $item) {
            $schoolYear = FeePolicie::findOrfail($item['fee_policie_clover_id']);

            $schoolYear->update(['FeePolicieCrmId' => $item['id']]);
        }
    }

    public function expectedToCollectMoney($attributes, $schoolYear, $dataTuition, $feePolicie, $listMonthAge)
    {
        $startDate = $schoolYear->StartDate;
        $endDate = $schoolYear->EndDate;

        $rangeMonth = collect(CarbonPeriod::create($startDate, '1 month', $endDate)->toArray());

        $data = [];

        foreach ($rangeMonth as $month) {
            $fee = [];
            $totalMoneyMonth = 0;
            foreach ($dataTuition as $value) {
                $feeTuiTion = Fee::find($value['feeId']);
                $paymentForm = PaymentForm::find($value['paymentFormId']);
                $value['applyDate'] = Carbon::parse($value['applyDate']);
                $applyDate = $value['applyDate']->format('Y-m');
                switch ($paymentForm->Code) {
                    case self::YEAR:
                        if ($applyDate == $month->format('Y-m')) {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => $value['money'],
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                            $totalMoneyMonth += $value['money'];
                        } else {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => 0,
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                        }
                        break;
                    case self::MONTH:
                        if ($applyDate == $month->format('Y-m')) {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => $value['money'],
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                            $totalMoneyMonth += $value['money'];
                        } else {
                            switch ($feeTuiTion->Type) {
                                case self::MEAL_FEE:
                                    if ($month->format('Y-m') >= $applyDate) {
                                        $changeParamDetail = $schoolYear->changeParameter->changeParameterDetail()->where('Date', $month->setDay(1)->format('Y-m-d'))->first();
                                        $result = $listMonthAge['replaceDetailStudent'][$month->setDay(1)->format('Y-m-d')]['money'] * $changeParamDetail->SchoolDay;
                                        $totalMoneyMonth += $result;

                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => $result,
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                    } else {
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => 0,
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                    }

                                    break;
                                case self::TUITION_FEE:
                                    $detailFeePolicie = $feePolicie->feeDetail()->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $attributes['classTypeId'])->get();

                                    $dataDate = [];
                                    foreach ($detailFeePolicie as $value) {
                                        $start_date = date_create($value->ApplyStartTime);
                                        $end_date   = date_create($value->ApplyEndTime);
                                        $interval = DateInterval::createFromDateString('1 day');
                                        $dateRange = new DatePeriod($start_date, $interval, $end_date);

                                        foreach ($dateRange as $date) {
                                            if (!array_key_exists($date->format('Y-m'), $dataDate)) {
                                                $dataDate[$date->format('Y-m')] = $value->OldStudent;
                                            }
                                        }
                                    }

                                    if (array_key_exists($month->format('Y-m'), $dataDate) && $month->format('Y-m') >= $applyDate) {
                                        $setDay = $month->day(1)->format('Y-m-d');
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => $listMonthAge['detailMoney'][$setDay],
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                        $totalMoneyMonth += $listMonthAge['detailMoney'][$setDay];
                                    } else {
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => 0,
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                    }

                                    break;

                                case self::BUS_FEE:
                                    if ($month->format('Y-m') >= $applyDate) {
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => $value['money'],
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                        $totalMoneyMonth += $value['money'];
                                    } else {
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => 0,
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                    }
                                    break;
                                default:
                                    $fee[] = [
                                        'fee_id' => $feeTuiTion->Id,
                                        'fee_name' => $feeTuiTion->Name,
                                        'money' => 0,
                                        'fee_id_crm' => $feeTuiTion->FeeCrmId
                                    ];
                                    $totalMoneyMonth += $value['moneyMonth'];
                                    break;
                            }
                        }

                        break;
                    case self::SEMESTER1:
                        $isMonth = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER1);
                            })->whereMonth('Date', $month->format('m'))->whereYear('Date', $month->format('Y'))->first();

                        if ($applyDate == $month->format('Y-m') && !is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => $value['money'],
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                            $totalMoneyMonth += $value['money'];
                        } else {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => 0,
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                        }
                        break;
                    case self::SEMESTER2:
                        $isMonth = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER2);
                            })->whereMonth('Date', $month->format('m'))->whereYear('Date', $month->format('Y'))->first();

                        if ($applyDate == $month->format('Y-m') && !is_null($isMonth)) {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => $value['money'],
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                            $totalMoneyMonth += $value['money'];
                        } else {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => 0,
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                        }
                        break;
                    case self::SEMESTER1_SEMESTER2 && $feeTuiTion->Type == self::BUS_FEE:
                        $detail = json_decode($attributes['details']);
                        $getMoney = array_column($detail, 'money');
                        $getValue = (array_filter($getMoney, function ($v, $k) {
                            return $v != null;
                        }, ARRAY_FILTER_USE_BOTH));
                        $money = array_values($getValue);

                        $dayAdmission = $value['applyDate']->format('Y-m-d');
                        $firstMonthHk1 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER1);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER2);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        if ($month->format('Y-m') >= $applyDate) {
                            if (!is_null($firstMonthHk1)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk1->Date)->format('Y-m'))) {
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => $money[0],
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                            } else if (!is_null($firstMonthHk2)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk2->Date)->format('Y-m'))) {
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => $money[0],
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                            } else {
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => 0,
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                            }
                        } else {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => 0,
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                        }
                        break;
                    case self::SEMESTER1_SEMESTER2:
                        $dayAdmission = $value['applyDate']->format('Y-m-d');
                        $firstMonthHk1 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER1);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = ChangeParameterDetail::where('ChangeParameterId', $schoolYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER2);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        if ($month->format('Y-m') >= $applyDate) {
                            if (!is_null($firstMonthHk1)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk1->Date)->format('Y-m'))) {
                                $dayAdmission = $month->format('Y-m') == $value['applyDate']->format('Y-m') ? $dayAdmission : $firstMonthHk1->StartDate;
                                $detail = [];
                                $detail[] = [
                                    'paymentFormId' => PaymentForm::where('Code', self::SEMESTER1)->first()->Id,
                                    'feeId' => $feeTuiTion->Id,
                                ];
                                $dataAttributes = [
                                    'studentId' => $attributes['studentId'],
                                    'classTypeId' => $attributes['classTypeId'],
                                    'schoolYearId' => $attributes['schoolYearId'],
                                    'student' => $attributes['student'],
                                    'branchId' => $attributes['branchId'],
                                    'dayAdmission' => $dayAdmission,
                                    'details' => json_encode($detail)
                                ];
                                $moneyFeePolicies = $this->moneyFeePolicies($dataAttributes, true);
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => $moneyFeePolicies['money'],
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                                $totalMoneyMonth += $moneyFeePolicies['money'];
                            } else if (!is_null($firstMonthHk2)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk2->Date)->format('Y-m'))) {
                                // $dayAdmission = $month->format('Y-m') == $value['applyDate']->format('Y-m') ? $dayAdmission : $firstMonthHk2->StartDate;
                                $detail = [];
                                $detail[] = [
                                    'paymentFormId' => PaymentForm::where('Code', self::SEMESTER2)->first()->Id,
                                    'feeId' => $feeTuiTion->Id,
                                ];

                                $dataAttributes = [
                                    'studentId' => $attributes['studentId'],
                                    'classTypeId' => $attributes['classTypeId'],
                                    'schoolYearId' => $attributes['schoolYearId'],
                                    'student' => $attributes['student'],
                                    'branchId' => $attributes['branchId'],
                                    'dayAdmission' => $dayAdmission,
                                    'details' => json_encode($detail)
                                ];

                                $moneyFeePolicies = $this->moneyFeePolicies($dataAttributes, true);
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => $moneyFeePolicies['money'],
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                                $totalMoneyMonth += $moneyFeePolicies['money'];
                            } else {
                                $fee[] = [
                                    'fee_id' => $feeTuiTion->Id,
                                    'fee_name' => $feeTuiTion->Name,
                                    'money' => 0,
                                    'fee_id_crm' => $feeTuiTion->FeeCrmId
                                ];
                            }
                        } else {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => 0,
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                        }
                        break;
                }
            }

            $data[] = [
                'month' =>  $month->format('Y-m'),
                'total_money_month' => $totalMoneyMonth,
                'fee' => $fee
            ];
        }

        return $data;
    }

    /**
     * Generate an array of string dates between 2 dates
     *
     * @param string $start Start date
     * @param string $end End date
     * @param string $format Output format (Default: Y-m-d)
     *
     * @return array
     */
    function getDatesFromRange($start, $end, $format = 'Y-m-d')
    {
        $array = array();
        $interval = new DateInterval('P1D');

        $realEnd = new DateTime($end);
        $realEnd->add($interval);

        $period = new DatePeriod(new DateTime($start), $interval, $realEnd);

        foreach ($period as $date) {
            $array[] = $date->format($format);
        }

        return $array;
    }

    function isWeekend($date)
    {
        return (date('N', strtotime($date)) >= 6);
    }

    function flatten(array $array)
    {
        $return = array();
        array_walk_recursive($array, function ($a) use (&$return) {
            $return[] = $a;
        });
        return $return;
    }

    public function checkDayThursdayFriday($schoolYear): bool
    {
        $holiday = Holiday::where('Name', $schoolYear->YearFrom)->first();

        if (!is_null($holiday)) {
            foreach ($holiday->holidayDetail as $detail) {
                foreach (CarbonPeriod::create($detail->StartDate, $detail->EndDate) as $key => $value) {

                    if ($value->isThursday()) {
                        $day1 = $value;
                    }

                    if ($value->isFriday()) {
                        $day2 = $value;
                    }
                }
            }

            if (isset($day1) && isset($day2) && $day1->addDay()->format('Y-m-d') === $day2->format('Y-m-d')) {
                return true;
            }
        }
        return false;
    }

    public function getAllDay($schoolYears)
    {
        foreach ($schoolYears as $key => $schoolYear) {
            $arrOfDate[] = $this->generateDateRange(Carbon::parse($schoolYear->StartDate), Carbon::parse($schoolYear->EndDate));
        }

        return call_user_func_array('array_merge', $arrOfDate);
    }

    public function generateDateRange(Carbon $startDate, Carbon $endDate)
    {
        $dates = [];

        $weekNumber = 1;
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {

            if ($date->isSunday() || $date->isSaturday()) {
                continue;
            }

            if ($startDate->format('Y-m-d') == $date->format('Y-m-d')) {
                $dates[$date->format('Y-m-d')] = $weekNumber;
            } elseif ($endDate->format('Y-m-d') == $date->format('Y-m-d')) {
                $dates[$date->format('Y-m-d')] = self::WEEKEND;
            } elseif ($date->isMonday()) {
                $dates[$date->format('Y-m-d')] = $weekNumber;
            } elseif ($date->isFriday()) {
                $dates[$date->format('Y-m-d')] = self::WEEKEND;
            } else {
                $dates[$date->format('Y-m-d')] =  $weekNumber;
            }

            if ($dates[$date->format('Y-m-d')] == self::WEEKEND) {
                $dates[$date->format('Y-m-d')] = [
                    'numberOfWeek' => $weekNumber++,
                    'isWeekend' => self::WEEKEND
                ];
            }
        }


        return $dates;
    }

    public function getMoneyByDate(array $arr, $attributes)
    {
        $arrDate = [];
        foreach ($arr as $value) {
            if (!array_key_exists($value['ClassTypeId'], $arrDate)) {
                switch ($attributes['student']) {
                    case 'new':
                        $money = $value['NewStudent'];
                        break;
                    case 'old':
                        $money = $value['OldStudent'];
                        break;
                }
                $arrDate[] = $this->getDatesFromRangeArr(Carbon::parse($value['ApplyStartTime']), Carbon::parse($value['ApplyEndTime']), $money);
            }
        }

        return call_user_func_array('array_merge', $arrDate);
    }

    function getDatesFromRangeArr($start_date, $end_date, $money, $date_format = 'Y-m-d')
    {
        $dates_array = array();
        for ($x = strtotime($start_date); $x <= strtotime($end_date); $x += 86400) {
            $dates_array[date($date_format, $x)] = $money;
        }

        return $dates_array;
    }

    //tính phí học sinh
    public function moneyFeePoliciesV2($attributes)
    {
        $details = json_decode($attributes['details'], true);

        //ngày nhập học
        $dayAdmission = $attributes['dayAdmission'];

        //năm học
        $schoolYear = SchoolYear::findOrFail($attributes['schoolYearId']);

        $allDateOfSchoolYear = $this->getAllDateOfSchoolYear($schoolYear);

        $isRestDay = $this->checkIsRestDay($allDateOfSchoolYear, $dayAdmission);

        if ($isRestDay) {
            throw new HttpException(400, 'Không được nhập học vào ngày nghỉ.');
        }
        //ngày bắt đầu của năm học
        $startDateSchoolYear = $schoolYear->StartDate;

        //ngày kết thúc của năm học
        $endDateSchoolYear = $schoolYear->EndDate;

        //học sinh
        $student = Student::findOrFail($attributes['studentId']);

        //tháng tuổi học sinh theo từng tháng của năm học 
        $listMonthAge = resolve(ChargeOldStudentRepositoryEloquent::class)->getMonthAgeDetailStudentBySchoolYear($schoolYear, $student, $dayAdmission, $allDateOfSchoolYear);

        //lấy cấu hình tiền đóng
        $feePolicie = FeePolicie::where('SchoolYearId', $attributes['schoolYearId'])->where('BranchId', $attributes['branchId'])->first();

        if (is_null($feePolicie)) {
            throw new HttpException(400, 'Chưa hoàn thành cấu hình tiền đóng.');
        }

        $collection = collect($details);
        $arrayFeedId = $collection->map(function ($item) {
            return $item['feeId'];
        })->toArray();

        //tên phí
        $fees = Fee::whereIn('Id', $arrayFeedId)->get();
        foreach ($details as $detail) {
            //hình thức đóng phí
            $paymentForm = PaymentForm::findOrFail($detail['paymentFormId']);

            if ($dayAdmission <= $startDateSchoolYear) {
                $results =  $this->calculatorCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie);
            } else {

                $isWeekend = $this->checkIsWeekend($allDateOfSchoolYear, $dayAdmission);
                $locationWeekOfTheMonth = $this->locationWeekOfTheMonth($allDateOfSchoolYear, $dayAdmission);
                $results =  $this->calculatorCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student);
            }

            $result = [
                'id' => isset($detail['id']) ? $detail['id'] : null,
                'feeId' => $detail['feeId'],
                'paymentFormId' => $detail['paymentFormId'],
                'money' => 0,
                'moneyMonth' => 0,
                'applyDate' => $attributes['dayAdmission']
            ];

            $data[] = $result;
        }

        $dataDetail = $this->handleExpectedToCollectMoney($startDateSchoolYear, $endDateSchoolYear, $results);

        return [
            'data' => $data,
            'detailData' => $dataDetail,
        ];
    }

    public function handleExpectedToCollectMoney($startDateSchoolYear, $endDateSchoolYear, $results)
    {
        $rangeMonth = collect(CarbonPeriod::create($startDateSchoolYear, '1 month', $endDateSchoolYear)->toArray());
        $totalMoneyMonth = 0;
        foreach ($rangeMonth as $month) {
            $fee = [];
            $totalMoneyMonth = 0;
            foreach ($results as $value) {
                if ($month->format('Y-m') == $value['month']) {
                    unset($value['month']);
                    $fee[] = $value;
                    $totalMoneyMonth += $value['money'];
                }
            }

            $data[] = [
                'month' =>  $month->format('Y-m'),
                'total_money_month' => $totalMoneyMonth,
                'fee' => $fee
            ];
        }

        return $data;
    }

    //lấy tất cả ngày ngày và số lượng ngày trong năm học trừ ngày lễ và thứ 7 chủ nhật,
    public function getAllDateOfSchoolYear($schoolYear)
    {
        // ở đây số 0 là để đánh dấu là thứ 7 chủ nhật hoặc lễ
        $data = [];
        $allDate = CarbonPeriod::create($schoolYear->StartDate, $schoolYear->EndDate);
        $holiday = Holiday::whereHas('holidayDetail', function ($query) use ($schoolYear) {
            $query->where('StartDate', '>=', $schoolYear->StartDate)->where('StartDate', '<=', $schoolYear->EndDate)->where('EndDate', '>=', $schoolYear->StartDate)->where('EndDate', '<=', $schoolYear->EndDate);
        })->first();

        foreach ($allDate as $key => $date) {
            foreach ($holiday->holidayDetail as $key => $holidayDetail) {
                if ($date->format('Y-m-d') >= $holidayDetail->StartDate->format('Y-m-d') && $date->format('Y-m-d') <= $holidayDetail->StartDate->format('Y-m-d')) {
                    $data[$date->format('Y-m-d')] = 0;
                } elseif ($date->isSunday() || $date->isSaturday()) {
                    $data[$date->format('Y-m-d')] = 0;
                } else {

                    if (!array_key_exists($date->format('Y-m-d'), $data)) {
                        $data[$date->format('Y-m-d')] = 1;
                    }
                }
            }
        }

        return $data;
    }

    //kiểm tra ngày nhập học của học sinh có phải vào cuối tuần hay không (ngày không liền kề thứ 7, hoặc lễ)
    public function checkIsWeekend($allDateOfSchoolYear, $dayAdmission)
    {
        foreach ($allDateOfSchoolYear as $key => $value) {
            if (Carbon::parse($dayAdmission)->addDays(1)->format('Y-m-d') == $key) {
                if ($value == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    //tìm tuần mà học sinh vào trong tháng
    public function locationWeekOfTheMonth($allDateOfSchoolYear, $dayAdmission)
    {
        $number = 1;
        $data = [];
        //chia tuần trong tháng
        foreach ($allDateOfSchoolYear as $key => $dateOfSchoolYear) {

            if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                if (Carbon::parse($key)->isSaturday() == true || Carbon::parse($key)->isSunday() == true) {
                    $number += 1;
                    continue;
                } else {
                    if (!array_key_exists($number, $data)) {
                        $data[$number][] = $key;
                    } else {

                        $data[$number][] = $key;
                    }
                }
            }
        }
        //tạo mới lại key trong mảng
        foreach ($data as $key => $value) {
            $newData[] = $value;
        }

        //tìm tuần trong tháng dựa vào ngày nhập học
        foreach ($newData as $key => $value) {
            if (array_search($dayAdmission, $value) !== false) {
                return $key + 1;
            }
        }
    }

    //kiểm tra ngày nhập học có phải ngày nghỉ không
    public function checkIsRestDay($allDateOfSchoolYear, $dayAdmission)
    {
        foreach ($allDateOfSchoolYear as $key => $value) {
            if ($dayAdmission == $key && $value == 0) {
                return true;
            }
        }
    }

    //tính phí học sinh vào trước ngày nhập học
    public function calculatorCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie)
    {
        switch ($paymentForm->Code) {
            case self::MONTH:
                $result = $this->calculatorMoneyFeeAndMoneyMealByMonthCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie);
                break;
            case self::YEAR:
                $result = $this->calculatorMoneyFeeAndMoneyMealByYearCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie);
                break;
            case self::SEMESTER1_SEMESTER2:
                $result = $this->calculatorMoneyFeeAndMoneyMealBySemesterCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie);
                break;
            default:
                # code...
                break;
        }

        return $result;
    }

    //tính tiền học phí và tiền ăn của học sinh theo tháng
    public function calculatorMoneyFeeAndMoneyMealByMonthCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie)
    {
        foreach ($listMonthAge['detailStudent'] as $monthAge) {

            foreach ($fees as $key => $fee) {
                if ($fee->Type == self::TUITION_FEE) {
                    $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                    $result[] = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => $feeDetail->OldStudent
                    ];
                }

                if ($fee->Type == self::MEAL_FEE) {
                    $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                    $result[] = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => $moneyMeal->Money * $monthAge['schoolDay'],
                    ];
                }
            }
        }

        return $result;
    }

    //tính tiền học phí và tiền ăn của học sinh theo năm
    public function calculatorMoneyFeeAndMoneyMealByYearCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie)
    {
        $totalFee = 0;
        $totalMealFee = 0;
        foreach ($listMonthAge['dataClassType'] as $key => $dataClassType) {
            if (is_array($dataClassType)) {
                $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $dataClassType['classTypeId'])->first();
                $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $dataClassType['classTypeId'])->first();
                $totalFee += (int) round(($feeDetail->OldStudent * $dataClassType['numberMonthCaseTwo']) / $listMonthAge['dataClassType']['totalMonthCaseTwo']);
                $totalMealFee += $moneyMeal->Money * $dataClassType['schoolDay'];
            }
        }


        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as  $fee) {
                if ($fee->Type == self::TUITION_FEE) {
                    $dataTuitionFee = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => !isset($dataTuitionFee) ? $totalFee : 0,
                    ];

                    $result[] = $dataTuitionFee;
                }

                if ($fee->Type == self::MEAL_FEE) {
                    $dataMealFee = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => !isset($dataMealFee) ? $totalMealFee : 0,
                    ];

                    $result[] = $dataMealFee;
                }
            }
        }

        return $result;
    }

    //tính tiền học phí và tiền ăn của học sinh theo kỳ
    public function calculatorMoneyFeeAndMoneyMealBySemesterCaseOne($listMonthAge, $fees, $paymentForm, $feePolicie)
    {
        $totalFeeSemester1 = 0;
        $totalFeeSemester2 = 0;
        $totalMealSemester1 = 0;
        $totalMealSemester2 = 0;

        foreach ($listMonthAge['dataPaymentForm'] as $dataPaymentForm) {
            foreach ($dataPaymentForm['dataClassType'] as $key => $value) {
                if ($dataPaymentForm['paymentFormCode'] == self::SEMESTER1) {
                    $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $dataPaymentForm['paymentFormId'])->where('ClassTypeId', $value['classTypeId'])->first();
                    $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $dataPaymentForm['paymentFormId'])->where('ClassTypeId', $value['classTypeId'])->first();

                    $totalMealSemester1 += $moneyMeal->Money * $value['schoolDay'];
                    $totalFeeSemester1 += ($feeDetail->OldStudent * $value['numberClassType']) / $dataPaymentForm['numberMonthInSemester'];
                }

                if ($dataPaymentForm['paymentFormCode'] == self::SEMESTER2) {

                    $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $dataPaymentForm['paymentFormId'])->where('ClassTypeId', $value['classTypeId'])->first();
                    $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $dataPaymentForm['paymentFormId'])->where('ClassTypeId', $value['classTypeId'])->first();

                    $totalMealSemester2 += $moneyMeal->Money * $value['schoolDay'];
                    $totalFeeSemester2 += ($feeDetail->OldStudent * $value['numberClassType']) / $dataPaymentForm['numberMonthInSemester'];
                }
            }
        }


        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as  $fee) {
                if ($fee->Type == self::TUITION_FEE) {
                    if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                        $dataTuitionFee = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => !isset($dataTuitionFee) ? $totalFeeSemester1 : 0,
                        ];
                    }

                    if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                        if (isset($isFirstMonthSemester2TuitionFee)) {
                            $dataTuitionFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' =>  0,
                            ];
                        } else {
                            $isFirstMonthSemester2TuitionFee = true;
                            $dataTuitionFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $totalFeeSemester2,

                            ];
                        }
                    }

                    $result[] = $dataTuitionFee;
                }

                if ($fee->Type == self::MEAL_FEE) {
                    if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                        $dataMealFee = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => !isset($dataMealFee) ? $totalMealSemester1 : 0,
                        ];
                    }

                    if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                        if (isset($isFirstMonthSemester2MealFee)) {
                            $dataMealFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => 0,
                            ];
                        } else {
                            $isFirstMonthSemester2MealFee = true;
                            $dataMealFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $totalMealSemester2,

                            ];
                        }
                    }

                    $result[] = $dataMealFee;
                }
            }
        }

        return $result;
    }

    //tính phí học sinh vào sau ngày nhập học
    public function calculatorCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student)
    {
        switch ($paymentForm->Code) {
            case self::MONTH:
                $result = $this->calculatorMoneyFeeAndMoneyMealByMonthCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission);
                break;
            case self::YEAR:
                $result = $this->calculatorMoneyFeeAndMoneyMealByYearCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student);
                break;
            case self::SEMESTER1_SEMESTER2:
                $result = $this->calculatorMoneyFeeAndMoneyMealBySemesterCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student);
                break;
            default:
                # code...
                break;
        }

        return $result;
    }

    //tính tiền học phí và tiền ăn của học sinh theo tháng
    public function calculatorMoneyFeeAndMoneyMealByMonthCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission)
    {
        foreach ($allDateOfSchoolYear as $key => $value) {
            if ($dayAdmission <= $key && Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                $dateOfMonth[] = $value;
            }
        }

        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as $key => $fee) {
                if ($isWeekend === false) {
                    if ($fee->Type == self::TUITION_FEE) {
                        $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $feeOneWeekOfMonth = $feeDetail->OldStudent / $monthAge['actualWeek'];
                            $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 1)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth
                            ];
                        } elseif (Carbon::parse($monthAge['month'])->format('Y-m') > Carbon::parse($dayAdmission)->format('Y-m')) {
                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $feeDetail->OldStudent
                            ];
                        } else {
                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => 0
                            ];
                        }
                    }
                } else {
                    if ($fee->Type == self::TUITION_FEE) {
                        $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $feeOneWeekOfMonth = $feeDetail->OldStudent / $monthAge['actualWeek'];
                            $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);

                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 0)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth
                            ];
                        } elseif (Carbon::parse($monthAge['month'])->format('Y-m') > Carbon::parse($dayAdmission)->format('Y-m')) {
                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $feeDetail->OldStudent
                            ];
                        } else {
                            $result[] = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => 0
                            ];
                        }
                    }
                }

                if ($fee->Type == self::MEAL_FEE) {
                    $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();

                    if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {
                        $result[] = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => $moneyMeal->Money * array_sum($dateOfMonth),
                        ];
                    } elseif (Carbon::parse($monthAge['month'])->format('Y-m') > Carbon::parse($dayAdmission)->format('Y-m')) {
                        $result[] = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' =>  $moneyMeal->Money * $monthAge['schoolDay'],
                        ];
                    } else {
                        $result[] = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => 0,
                        ];
                    }
                }
            }
        }

        return $result;
    }

    //tính tiền học phí và tiền ăn của học sinh theo năm
    public function calculatorMoneyFeeAndMoneyMealByYearCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student)
    {
        $totalFee = 0;
        $totalMealFee = 0;
        foreach ($listMonthAge['dataClassType'] as $key => $dataClassType) {
            dd($listMonthAge['dataClassType']);
            if (is_array($dataClassType)) {
                $ageMonth = ((Carbon::parse($dayAdmission)->format('Y') - Carbon::parse($student->DayOfBirth)->format('Y')) * 12) + (Carbon::parse($dayAdmission)->format('m') - Carbon::parse($student->DayOfBirth)->format('m'));
                $classType = ClassType::where('From', '<=', $ageMonth)->where('To', '>=', $ageMonth)->first();

                if ($classType->Id == $dataClassType['classTypeId']) {
                    $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $dataClassType['classTypeId'])->first();
                    $totalMealFee += $moneyMeal->Money * ($dataClassType['schoolDay'] - $dataClassType['dateOfMonth']);
                } else {
                    $classTypeBigger = ClassType::findOrFail($dataClassType['classTypeId']);
                
                    if ($classTypeBigger->To > $classType->To) {
                        $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $dataClassType['classTypeId'])->first();
                       
                        $totalMealFee += $moneyMeal->Money * ($dataClassType['schoolDay'] - $dataClassType['dateOfMonth']);
                        //dd($totalMealFee);
                    }
                }
            }
        }

        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as $key => $fee) {
                if ($isWeekend === false) {
                    if ($fee->Type == self::TUITION_FEE) {
                        $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                            $feeOfMonth = $feeDetail->OldStudent / $listMonthAge['dataClassType']['totalMonthCaseTwo'];

                            $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                            $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                            $totalFee = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 1)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                        } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $feeOfMonth = $feeDetail->OldStudent / $listMonthAge['dataClassType']['totalMonthCaseTwo'];
                            $totalFee += $feeOfMonth;
                        } else {
                            $totalFee += 0;
                        }
                    }
                } else {
                    if ($fee->Type == self::TUITION_FEE) {
                        $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                            $feeOfMonth = $feeDetail->OldStudent / $listMonthAge['dataClassType']['totalMonthCaseTwo'];

                            $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                            $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                            $totalFee = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 0)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                        } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $feeOfMonth = $feeDetail->OldStudent / $listMonthAge['dataClassType']['totalMonthCaseTwo'];
                            $totalFee += $feeOfMonth;
                        } else {
                            $totalFee += 0;
                        }
                    }
                }
            }
        }

        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as  $fee) {
                if ($fee->Type == self::TUITION_FEE) {
                    $dataTuitionFee = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => !isset($dataTuitionFee) ? $totalFee : 0,
                    ];

                    $result[] = $dataTuitionFee;
                }

                if ($fee->Type == self::MEAL_FEE) {
                    $dataMealFee = [
                        'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                        'fee_id' => $fee->Id,
                        'fee_id_crm' => $fee->FeeCrmId,
                        'fee_name' => $fee->Name,
                        'money' => !isset($dataMealFee) ? $totalMealFee : 0,
                    ];

                    $result[] = $dataMealFee;
                }
            }
        }

        return $result;
    }

    public function calculatorMoneyFeeAndMoneyMealBySemesterCaseTwo($listMonthAge, $fees, $paymentForm, $feePolicie, $allDateOfSchoolYear, $isWeekend, $locationWeekOfTheMonth, $dayAdmission, $student)
    {
        $totalFeeSemester1 = 0;
        $totalFeeSemester2 = 0;
        $totalMealSemester1 = 0;
        $totalMealSemester2 = 0;

        foreach ($listMonthAge['dataPaymentForm'] as $dataPaymentForm) {
            if ($dataPaymentForm['paymentFormCode'] == self::SEMESTER1) {
                $numberMonthInSemester1 = $dataPaymentForm['numberMonthInSemester'];
            }

            if ($dataPaymentForm['paymentFormCode'] == self::SEMESTER2) {
                $numberMonthInSemester2 = $dataPaymentForm['numberMonthInSemester'];
            }
        }

        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as $key => $fee) {
                if ($isWeekend === false) {
                    if ($fee->Type == self::TUITION_FEE) {
                        if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                            $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();

                            if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester1;

                                $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                                $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                                $totalFeeSemester1 = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 1)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                            } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester1;
                                $totalFeeSemester1 += $feeOfMonth;
                            } else {
                                $totalFeeSemester1 += 0;
                            }
                        }

                        if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                            $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();

                            if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester2;

                                $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                                $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                                $totalFeeSemester2 = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 1)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                            } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester2;
                                $totalFeeSemester2 += $feeOfMonth;
                            } else {
                                $totalFeeSemester2 += 0;
                            }
                        }
                    }
                } else {
                    if ($fee->Type == self::TUITION_FEE) {
                        if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                            $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();

                            if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester1;

                                $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                                $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                                $totalFeeSemester1 = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 0)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                            } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester1;
                                $totalFeeSemester1 += $feeOfMonth;
                            } else {
                                $totalFeeSemester1 += 0;
                            }
                        }

                        if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                            $feeDetail = FeeDetail::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();

                            if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {

                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester2;

                                $feeOneWeekOfMonth = $feeOfMonth / $monthAge['actualWeek'];
                                $feeRemainingWeekOfMonth = $feeOneWeekOfMonth * ($monthAge['actualWeek'] - $locationWeekOfTheMonth);
                                $totalFeeSemester2 = (($monthAge['actualWeek'] - ($locationWeekOfTheMonth - 0)) / $monthAge['actualWeek'] * $feeOneWeekOfMonth) + $feeRemainingWeekOfMonth;
                            } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                                $feeOfMonth = $feeDetail->OldStudent / $numberMonthInSemester2;
                                $totalFeeSemester2 += $feeOfMonth;
                            } else {
                                $totalFeeSemester2 += 0;
                            }
                        }
                    }
                }

                if ($fee->Type == self::MEAL_FEE) {
                    // $ageMonth = ((Carbon::parse($dayAdmission)->format('Y') - Carbon::parse($student->DayOfBirth)->format('Y')) * 12) + (Carbon::parse($dayAdmission)->format('m') - Carbon::parse($student->DayOfBirth)->format('m'));
                    // $classType = ClassType::where('From', '<=', $ageMonth)->where('To', '>=', $ageMonth)->first();

                    // if ($classType->Id == $monthAge['classTypeId']) {
                    // }
                    if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                        $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {
                            foreach ($allDateOfSchoolYear as $key => $dateOfSchoolYear) {
                                if ($dayAdmission > $key && Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                                    //số ngày trong tháng trước lúc bé nhập học
                                    $dateOfMonth[] = $dateOfSchoolYear;
                                }
                            }

                            $totalMealSemester1 = $moneyMeal->Money * ($monthAge['schoolDay'] - array_sum($dateOfMonth));
                        } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $totalMealSemester1 +=  $moneyMeal->Money * $monthAge['schoolDay'];
                        } else {
                            $totalMealSemester1 += 0;
                        }
                    }

                    if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                        $moneyMeal = MoneyMeal::where('FeePoliceId', $feePolicie->Id)->where('PaymentFormId', $monthAge['idPaymentForm'])->where('ClassTypeId', $monthAge['classTypeId'])->first();
                        if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($monthAge['month'])->format('Y-m')) {
                            foreach ($allDateOfSchoolYear as $key => $dateOfSchoolYear) {
                                if ($dayAdmission > $key && Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                                    //số ngày trong tháng trước lúc bé nhập học
                                    $dateOfMonth2[] = $dateOfSchoolYear;
                                }
                            }
                            $totalMealSemester2 = $moneyMeal->Money * ($monthAge['schoolDay'] - array_sum($dateOfMonth2));
                        } elseif (Carbon::parse($dayAdmission)->format('Y-m') < Carbon::parse($monthAge['month'])->format('Y-m')) {
                            $totalMealSemester2 +=  $moneyMeal->Money * $monthAge['schoolDay'];
                        } else {
                            $totalMealSemester2 += 0;
                        }
                    }
                }
            }
        }

        foreach ($listMonthAge['detailStudent'] as $monthAge) {
            foreach ($fees as  $fee) {
                if ($fee->Type == self::TUITION_FEE) {
                    if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                        $dataTuitionFee = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => !isset($dataTuitionFee) ? $totalFeeSemester1 : 0,
                        ];
                    }

                    if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                        if (isset($isFirstMonthSemester2TuitionFee)) {
                            $dataTuitionFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' =>  0,
                            ];
                        } else {
                            $isFirstMonthSemester2TuitionFee = true;
                            $dataTuitionFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $totalFeeSemester2,

                            ];
                        }
                    }

                    $result[] = $dataTuitionFee;
                }

                if ($fee->Type == self::MEAL_FEE) {
                    if ($monthAge['paymentFormCode'] == self::SEMESTER1) {
                        $dataMealFee = [
                            'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                            'fee_id' => $fee->Id,
                            'fee_id_crm' => $fee->FeeCrmId,
                            'fee_name' => $fee->Name,
                            'money' => !isset($dataMealFee) ? $totalMealSemester1 : 0,
                        ];
                    }

                    if ($monthAge['paymentFormCode'] == self::SEMESTER2) {
                        if (isset($isFirstMonthSemester2MealFee)) {
                            $dataMealFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => 0,
                            ];
                        } else {
                            $isFirstMonthSemester2MealFee = true;
                            $dataMealFee = [
                                'month' => Carbon::parse($monthAge['month'])->format('Y-m'),
                                'fee_id' => $fee->Id,
                                'fee_id_crm' => $fee->FeeCrmId,
                                'fee_name' => $fee->Name,
                                'money' => $totalMealSemester2,

                            ];
                        }
                    }

                    $result[] = $dataMealFee;
                }
            }
        }

        return $result;
    }
}
