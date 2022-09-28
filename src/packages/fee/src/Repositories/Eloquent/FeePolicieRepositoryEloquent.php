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
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Models\FeePolicie;
use GGPHP\Fee\Models\MoneyBus;
use GGPHP\Fee\Models\PaymentForm;
use GGPHP\Fee\Presenters\FeePoliciePresenter;
use GGPHP\Fee\Repositories\Contracts\FeePolicieRepository;
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

        $schooleYear = \GGPHP\Fee\Models\SchoolYear::findOrFail($attributes['schoolYearId']);

        foreach ($details as $key => $detail) {
            $fee = \GGPHP\Fee\Models\Fee::findOrFail($detail->feeId);
            $paymentForm = \GGPHP\Fee\Models\PaymentForm::findOrFail($detail->paymentFormId);
            $dayAdmission = isset($detail->applyDate) ? $detail->applyDate : $attributes['dayAdmission'];
            $totalMonth = $schooleYear->TotalMonth;

            $weekDayAdmission = $schooleYear->timetable()->whereDate('StartDate', '<=', $dayAdmission)->whereDate('EndDate', '>=', $dayAdmission)->first();
            $money = 0;
            $result = 0;
            $moneyMonth = 0;

            if (!is_null($weekDayAdmission)) {
                $endMonth = Carbon::parse($weekDayAdmission->EndDate)->endOfMonth();

                $timetable = $schooleYear->timetable->where('Month', $weekDayAdmission->Month);

                $month = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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

                $getEndDate = $schooleYear->changeParameter->changeParameterDetail()->whereMonth('EndDate', $dayAdmissionCarbon->format('m'))->whereYear('EndDate', $dayAdmissionCarbon->format('Y'))->first();
                $begin = new DateTime($dayAdmission);
                $end = new DateTime($getEndDate->EndDate);

                if (!is_null($feePolicie)) {
                    switch ($fee->Type) {
                        case self::TUITION_FEE:
                            $feeDetail = $feePolicie->feeDetail()
                                ->where('ClassTypeId', $attributes['classTypeId'])
                                ->where('PaymentFormId', $detail->paymentFormId)->first();

                            if (!is_null($feeDetail)) {
                                switch ($attributes['student']) {
                                    case 'new':
                                        $money = $feeDetail->NewStudent;
                                        break;
                                    case 'old':
                                        $money = $feeDetail->OldStudent;
                                        break;
                                }

                                switch ($paymentForm->Code) {
                                    case self::SEMESTER1:
                                        $isMonth =  \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();
                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        $monthStart = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)->orderBy('StartDate')->first();
                                        $monthStudied = $monthAdmission->diffInMonths(Carbon::parse($monthStart->StartDate)->floorMonth()) + 1;

                                        // tháng học kỳ 1
                                        $monthsemester1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', self::SEMESTER1);
                                            })->get();

                                        $totalMonthsemester1 = 0;

                                        foreach ($monthsemester1 as $value) {
                                            $totalMonthsemester1 += $value->FullMonth;
                                        }

                                        if ($totalMonthsemester1 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthsemester1 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester1 - $monthStudied);
                                        }
                                        break;
                                    case self::SEMESTER2:
                                        $isMonth =  \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();
                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        $monthStart = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)->orderBy('StartDate')->first();
                                        $monthStudied = $monthAdmission->diffInMonths(Carbon::parse($monthStart->StartDate)->floorMonth()) + 1;

                                        // tháng học kỳ 2
                                        $monthSemester2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', self::SEMESTER2);
                                            })->get();
                                        $totalMonthSemester2 = 0;

                                        foreach ($monthSemester2 as $value) {
                                            $totalMonthSemester2 += $value->FullMonth;
                                        }

                                        if ($totalMonthSemester2 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthSemester2 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthSemester2 - $monthStudied);
                                        }
                                        break;
                                    case self::YEAR:
                                        $monthStart = Carbon::parse($schooleYear->StartDate)->floorMonth();
                                        $monthStudied = $monthAdmission->diffInMonths($monthStart) + 1;

                                        if ($totalMonth > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonth * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonth - $monthStudied);
                                        }
                                        break;
                                    case self::MONTH:

                                        if ($totalWeekStudyInMonth > 0) {
                                            $result = $money * ($remainingWeek / $totalWeekStudyInMonth);
                                            $moneyMonth = $money;
                                        }
                                        break;
                                }
                            }
                            break;
                        case self::MEAL_FEE:
                            $listMonthAge = resolve(ChargeOldStudentRepositoryEloquent::class)->getMonthAgeDetailStudent($attributes);

                            $getFirstFeeDetail = $feePolicie->moneyMeal()
                                ->where('ClassTypeId', $listMonthAge['countClassType'][0])
                                ->where('PaymentFormId', $detail->paymentFormId)->first();

                            foreach ($listMonthAge['detailStudent'] as $key => $valueMonthAge) {
                                $feeDetail = $feePolicie->moneyMeal()
                                    ->where('ClassTypeId', $valueMonthAge['classTypeId'])
                                    ->where('PaymentFormId', $detail->paymentFormId)
                                    ->first();

                                $listMonthAge['detailStudent'][$key]['money'] = $feeDetail->Money;
                            }

                            $arrDate = $this->getDatesFromRange($begin->format('Y-m-d'), $end->format('Y-m-d'));

                            foreach ($arrDate as $key => $value) {

                                if ($this->isWeekend($value)) {
                                    unset($arrDate[$key]);
                                }

                                $date = new DateTime($value);
                                $holidayDetail = HolidayDetail::whereYear('StartDate', $date->format('Y'))->orWhereYear('EndDate', $date->format('Y'))->get();
                                $arrHoliday = [];
                                foreach ($holidayDetail as $key => $valueHolidayDetail) {
                                    $arrHoliday[] = $this->getDatesFromRange($valueHolidayDetail->StartDate, $valueHolidayDetail->EndDate);
                                }
                                $arrFlatten = $this->flatten($arrHoliday);
                            }

                            $totalDaySemester1 = count(array_diff($arrDate, $arrFlatten));

                            if (!is_null($feeDetail)) {
                                $money = !is_null($getFirstFeeDetail) ? $getFirstFeeDetail->Money : 0;
                                switch ($paymentForm->Code) {
                                    case self::SEMESTER1:
                                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();

                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        // tháng còn lại học kỳ 1
                                        $monthSemesterLeft1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();

                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        // tháng còn lại học kỳ 2
                                        $monthSemesterLeft2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                                        // tháng còn lại năm học
                                        $monthLeft = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($month) {
                                                $query->where('StartDate', '>', $month->EndDate);
                                                $query->where('Date', '!=', $month->Date);
                                            })->get();

                                        $sumAllYear = 0;
                                        foreach ($monthLeft as $key => $valueAllYear) {
                                            $sumAllYear += $listMonthAge['detailStudent'][$valueAllYear->Date]['money'] * $valueAllYear->SchoolDay;
                                        }
                                        dd($listMonthAge['detailStudent']);
                                        $result = $listMonthAge['detailStudent'][$month->Date]['money'] * $totalDaySemester1 + $sumAllYear;

                                        break;
                                    case self::MONTH:
                                        $result = $totalDaySemester1 * $listMonthAge['detailStudent'][$month->Date]['money'];
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

        $detailData = $this->expectedToCollectMoney($attributes, $schooleYear, $data, $feePolicie, $listMonthAge);

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

    public function expectedToCollectMoney($attributes, $schooleYear, $dataTuition, $feePolicie, $listMonthAge)
    {
        $startDate = $schooleYear->StartDate;
        $endDate = $schooleYear->EndDate;

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
                                        $changeParamDetail = $schooleYear->changeParameter->changeParameterDetail()->where('Date', $month->setDay(1)->format('Y-m-d'))->first();
                                        $result = $listMonthAge['detailStudent'][$month->setDay(1)->format('Y-m-d')]['money'] * $changeParamDetail->SchoolDay;
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
                                        $fee[] = [
                                            'fee_id' => $feeTuiTion->Id,
                                            'fee_name' => $feeTuiTion->Name,
                                            'money' => $dataDate[$month->format('Y-m')],
                                            'fee_id_crm' => $feeTuiTion->FeeCrmId
                                        ];
                                        $totalMoneyMonth += $dataDate[$month->format('Y-m')];
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
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                        $firstMonthHk1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER1);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                        $firstMonthHk1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', self::SEMESTER1);
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
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
                                $dayAdmission = $month->format('Y-m') == $value['applyDate']->format('Y-m') ? $dayAdmission : $firstMonthHk2->StartDate;
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
}
