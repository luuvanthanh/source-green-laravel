<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use DateInterval;
use DatePeriod;
use Exception;
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
            throw new Exception('Chưa hoàn thành cấu hình Chính sách phí.');
        }

        $schooleYear = \GGPHP\Fee\Models\SchoolYear::findOrFail($attributes['schoolYearId']);

        foreach ($details as $key => $detail) {
            $fee = \GGPHP\Fee\Models\Fee::findOrFail($detail->feeId);
            $paymentForm = \GGPHP\Fee\Models\PaymentForm::findOrFail($detail->paymentFormId);
            $dayAdmission = isset($detail->applyDate) ? $detail->applyDate : $attributes['dayAdmission'];
            $totalMonth = $schooleYear->TotalMonth;
            $weekDayAdmission = $schooleYear->timetable->where('StartDate', '<=', $dayAdmission)->where('EndDate', '>=', $dayAdmission)->first();
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
                if (!is_null($feePolicie)) {
                    switch ($fee->Type) {
                        case 'HP':
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
                                    case 'HOCKY1':
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
                                                $query->where('Code', 'HOCKY1');
                                            })->get();

                                        $totalMonthsemester1 = 0;

                                        foreach ($monthsemester1 as $value) {
                                            $totalMonthsemester1 += $value->FullMonth;
                                        }

                                        if ($totalMonthsemester1 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthsemester1 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester1 - $monthStudied);
                                        }
                                        break;
                                    case 'HOCKY2':
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
                                        $monthsemester2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', 'HOCKY2');
                                            })->get();
                                        $totalMonthsemester2 = 0;

                                        foreach ($monthsemester2 as $value) {
                                            $totalMonthsemester2 += $value->FullMonth;
                                        }

                                        if ($totalMonthsemester2 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthsemester2 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester2 - $monthStudied);
                                        }
                                        break;
                                    case 'NAM':
                                        $monthStart = Carbon::parse($schooleYear->StartDate)->floorMonth();
                                        $monthStudied = $monthAdmission->diffInMonths($monthStart) + 1;

                                        if ($totalMonth > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonth * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonth - $monthStudied);
                                        }
                                        break;
                                    case 'THANG':

                                        if ($totalWeekStudyInMonth > 0) {
                                            $result = $money * ($remainingWeek / $totalWeekStudyInMonth);
                                            $moneyMonth = $money;
                                        }
                                        break;
                                }
                            }
                            break;
                        case 'TIENAN':
                            $feeDetail = $feePolicie->moneyMeal()
                                ->where('ClassTypeId', $attributes['classTypeId'])
                                ->where('PaymentFormId', $detail->paymentFormId)->first();

                            if (!is_null($feeDetail)) {
                                $money = $feeDetail->Money;
                                switch ($paymentForm->Code) {
                                    case 'HOCKY1':
                                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();

                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        // tháng còn lại học kỳ 1
                                        $monthsemesterLeft1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($month) {
                                                $query->where('Code', 'HOCKY1');
                                                $query->where('Date', '!=', $month->Date);
                                                $query->where('StartDate', '>', $month->EndDate);
                                            })->get();
                                        // tháng học kỳ 1
                                        $monthsemester1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', 'HOCKY1');
                                            })->get();

                                        $totalSchoolDay = 0;
                                        if (count($monthsemester1) > 0) {
                                            foreach ($monthsemester1 as $value) {
                                                $totalSchoolDay += $value->SchoolDay;
                                            }
                                        }

                                        $totalSchoolDayLeft = 0;
                                        if (count($monthsemesterLeft1) > 0) {
                                            foreach ($monthsemesterLeft1 as $value) {

                                                $totalSchoolDayLeft += $value->SchoolDay;
                                            }
                                        }

                                        if ($money > 0 && $totalSchoolDay > 0) {

                                            $result = $money / $totalSchoolDay * ($daysLeftInMonth - $totalDayWeekend + $totalSchoolDayLeft);
                                        }
                                        break;
                                    case 'HOCKY2':
                                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->where('PaymentFormId', $detail->paymentFormId)
                                            ->whereMonth('Date', $monthAdmission->format('m'))->whereYear('Date', $monthAdmission->format('Y'))
                                            ->first();

                                        if (is_null($isMonth)) {
                                            break;
                                        }

                                        // tháng còn lại học kỳ 2
                                        $monthsemesterLeft2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($month) {
                                                $query->where('Code', 'HOCKY2');
                                                $query->where('Date', '!=', $month->Date);
                                                $query->where('StartDate', '>', $month->EndDate);
                                            })->get();

                                        // tháng học kỳ 2
                                        $monthsemester2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', 'HOCKY2');
                                            })->get();

                                        $totalSchoolDay = 0;
                                        if (count($monthsemester2) > 0) {
                                            foreach ($monthsemester2 as $value) {
                                                $totalSchoolDay += $value->SchoolDay;
                                            }
                                        }

                                        $totalSchoolDayLeft = 0;
                                        if (count($monthsemesterLeft2) > 0) {
                                            foreach ($monthsemesterLeft2 as $value) {

                                                $totalSchoolDayLeft += $value->SchoolDay;
                                            }
                                        }

                                        if ($money > 0 && $totalSchoolDay > 0) {
                                            $result = $money / $totalSchoolDay * ($daysLeftInMonth - $totalDayWeekend + $totalSchoolDayLeft);
                                        }
                                        break;
                                    case 'NAM':
                                        // tháng còn lại năm học
                                        $monthLeft = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($month) {
                                                $query->where('StartDate', '>', $month->EndDate);
                                                $query->where('Date', '!=', $month->Date);
                                            })->get();

                                        // tháng năm học
                                        $monthYear = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)->get();

                                        $totalSchoolDay = 0;
                                        if (count($monthYear) > 0) {
                                            foreach ($monthYear as $value) {
                                                $totalSchoolDay += $value->SchoolDay;
                                            }
                                        }

                                        $totalSchoolDayLeft = 0;
                                        if (count($monthLeft) > 0) {
                                            foreach ($monthLeft as $value) {

                                                $totalSchoolDayLeft += $value->SchoolDay;
                                            }
                                        }

                                        if ($money > 0 && $totalSchoolDay > 0) {
                                            $result = ($money / $totalSchoolDay) * ($daysLeftInMonth - $totalDayWeekend + $totalSchoolDayLeft);
                                        }
                                        break;
                                    case 'THANG':
                                        $result = ($daysLeftInMonth - $totalDayWeekend) * $money;
                                        $moneyMonth = $money;
                                        break;
                                }
                            }
                            break;
                        case 'KHAC':
                            $feeDetail = $feePolicie->otherMoneyDetail()
                                ->where('ClassTypeId', $attributes['classTypeId'])
                                ->where('FeeId', $detail->feeId)
                                ->where('PaymentFormId', $detail->paymentFormId)->first();
                            if (!is_null($feeDetail)) {
                                $money = $feeDetail->Money;
                                $result = $money;

                                switch ($paymentForm->Code) {
                                    case 'THANG':
                                        $moneyMonth = $result;
                                        break;
                                }
                                break;
                            }
                            break;
                        case 'XEBUS':
                            if (isset($detail->money)) {
                                $result = $detail->money;
                                switch ($paymentForm->Code) {
                                    case 'THANG':
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

        $detailData = $this->expectedToCollectMoney($attributes, $schooleYear, $data, $feePolicie);

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

    public function expectedToCollectMoney($attributes, $schooleYear, $dataTuition, $feePolicie)
    {
        $startDate = $schooleYear->StartDate;
        $endDate = $schooleYear->EndDate;

        $tuition = $dataTuition;
        $rangeMonth = collect(CarbonPeriod::create($startDate, '1 month', $endDate)->toArray());

        $data = [];

        foreach ($rangeMonth as $month) {
            $fee = [];
            $totalMoneyMonth = 0;
            foreach ($tuition as $value) {
                $feeTuiTion = Fee::find($value['feeId']);

                $paymentForm = PaymentForm::find($value['paymentFormId']);
                $value['applyDate'] = Carbon::parse($value['applyDate']);
                $applyDate = $value['applyDate']->format('Y-m');
                switch ($paymentForm->Code) {
                    case 'NAM':
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
                    case 'THANG':

                        if ($applyDate ==  $month->format('Y-m')) {
                            $fee[] = [
                                'fee_id' => $feeTuiTion->Id,
                                'fee_name' => $feeTuiTion->Name,
                                'money' => $value['money'],
                                'fee_id_crm' => $feeTuiTion->FeeCrmId
                            ];
                            $totalMoneyMonth += $value['money'];
                        } else {
                            switch ($feeTuiTion->Type) {
                                case 'TIENAN':
                                    $timetable = $schooleYear->timetable()->where('Month', 'Tháng ' . $month->format('m') . '/' . $month->format('Y'))->where('Week', 1)->first();

                                    $dayAdmission = $timetable->StartDate;
                                    $endMonth = Carbon::parse($timetable->EndDate)->endOfMonth();
                                    $daysLeftInMonth = $endMonth->diffInDays($dayAdmission) + 1;

                                    $totalDayWeekend = $this->countWeekend($dayAdmission, $endMonth->format('Y-m-d'));

                                    $result = ($daysLeftInMonth - $totalDayWeekend) * $value['moneyMonth'];
                                    $totalMoneyMonth += $result;

                                    $fee[] = [
                                        'fee_id' => $feeTuiTion->Id,
                                        'fee_name' => $feeTuiTion->Name,
                                        'money' => $result,
                                        'fee_id_crm' => $feeTuiTion->FeeCrmId
                                    ];
                                    break;
                                case 'HP':
                                    $detailFeePolicie = $feePolicie->feeDetail->where('PaymentFormId', $paymentForm->Id)->where('ClassTypeId', $attributes['classTypeId']);
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

                                    if (array_key_exists($month->format('Y-m'), $dataDate)) {
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
                    case 'HOCKY1':
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY1');
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
                    case 'HOCKY2':
                        $isMonth = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY2');
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
                    case 'HOCKY1_HOCKY2' && $feeTuiTion->Type == 'XEBUS':
                        $detail = json_decode($attributes['details']);
                        $getMoney = array_column($detail, 'money');
                        $getValue = (array_filter($getMoney, function ($v, $k) {
                            return $v != null;
                        }, ARRAY_FILTER_USE_BOTH));
                        $money = array_values($getValue);

                        $dayAdmission = $value['applyDate']->format('Y-m-d');
                        $firstMonthHk1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY1');
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY2');
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
                    case 'HOCKY1_HOCKY2':
                        $dayAdmission = $value['applyDate']->format('Y-m-d');
                        $firstMonthHk1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY1');
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        $firstMonthHk2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                            ->whereHas('paymentForm', function ($query) {
                                $query->where('Code', 'HOCKY2');
                            })
                            ->where('Date', '>=', $value['applyDate']->startOfMonth()->format('Y-m-d'))->orderBy('Date', 'ASC')->first();

                        if ($month->format('Y-m') >= $applyDate) {
                            if (!is_null($firstMonthHk1)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk1->Date)->format('Y-m'))) {
                                $dayAdmission = $month->format('Y-m') == $value['applyDate']->format('Y-m') ? $dayAdmission : $firstMonthHk1->StartDate;
                                $detail = [];
                                $detail[] = [
                                    'paymentFormId' => PaymentForm::where('Code', 'HOCKY1')->first()->Id,
                                    'feeId' => $feeTuiTion->Id,
                                ];
                                $dataAttributes = [
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
                            } else if (!is_null($firstMonthHk2)  && ($month->format('Y-m') ==  Carbon::parse($firstMonthHk2->Date)->format('Y-m'))) {
                                $dayAdmission = $month->format('Y-m') == $value['applyDate']->format('Y-m') ? $dayAdmission : $firstMonthHk2->StartDate;
                                $detail = [];
                                $detail[] = [
                                    'paymentFormId' => PaymentForm::where('Code', 'HOCKY2')->first()->Id,
                                    'feeId' => $feeTuiTion->Id,
                                ];

                                $dataAttributes = [
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
}
