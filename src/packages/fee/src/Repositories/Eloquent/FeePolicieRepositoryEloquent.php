<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\FeePolicie;
use GGPHP\Fee\Presenters\FeePoliciePresenter;
use GGPHP\Fee\Repositories\Contracts\FeePolicieRepository;
use Illuminate\Support\Facades\DB;
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
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::find($feePolicie->Id);
    }

    public function moneyFeePolicies(array $attributes)
    {

        $details = json_decode($attributes['details']);
        $data = [];
        $feePolicie = FeePolicie::where('SchoolYearId', $attributes['schoolYearId'])->first();
        $schooleYear = \GGPHP\Fee\Models\SchoolYear::findOrFail($attributes['schoolYearId']);
        foreach ($details as $key => $detail) {

            $fee = \GGPHP\Fee\Models\Fee::findOrFail($detail->feeId);
            $paymentForm = \GGPHP\Fee\Models\PaymentForm::findOrFail($detail->paymentFormId);

            $dayAdmission = $attributes['dayAdmission'];
            $totalMonth = $schooleYear->TotalMonth;
            $weekDayAdmission = $schooleYear->timetable->where('StartDate', '<=', $dayAdmission)->where('EndDate', '>=', $dayAdmission)->first();
            $money = 0;
            $result = 0;

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

                $monthAdmission = Carbon::parse($dayAdmission)->setDay(1);
                $monthStart = Carbon::parse($schooleYear->StartDate)->setDay(1);

                $daysLeftInMonth = $endMonth->diffInDays($dayAdmission) + 1;

                $totalDayWeekend = $this->countWeekend($dayAdmission, $endMonth->format('Y-m-d'));

                $monthStudied = $monthAdmission->diffInMonths($monthStart) + 1;

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
                                        // tháng học kỳ 1
                                        $monthsemester1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', 'HOCKY1');
                                            })->get();

                                        $totalMonthsemester1 = count($monthsemester1);

                                        if ($totalMonthsemester1 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthsemester1 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester1 - $monthStudied);
                                        }
                                        break;
                                    case 'HOCKY2':
                                        // tháng học kỳ 2
                                        $monthsemester2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) {
                                                $query->where('Code', 'HOCKY2');
                                            })->get();

                                        $totalMonthsemester2 = count($monthsemester2);

                                        if ($totalMonthsemester2 > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonthsemester2 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester2 - $monthStudied);
                                        }
                                        break;
                                    case 'NAM':
                                        if ($totalMonth > 0 && $totalWeekStudyInMonth > 0) {
                                            $result = $money / $totalMonth * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonth - $monthStudied);
                                        }
                                        break;
                                    case 'THANG':
                                        if ($totalWeekStudyInMonth > 0) {
                                            $result = $money * ($remainingWeek / $totalWeekStudyInMonth);
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
                                        // tháng còn lại học kỳ 1
                                        $monthsemesterLeft1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($endMonth) {
                                                $query->where('Code', 'HOCKY1');
                                                $query->where('StartDate', '>', $endMonth);
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
                                        // tháng còn lại học kỳ 2
                                        $monthsemesterLeft2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
                                            ->whereHas('paymentForm', function ($query) use ($endMonth) {
                                                $query->where('Code', 'HOCKY2');
                                                $query->where('StartDate', '>', $endMonth);
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
                                        if (count($monthsemesterLeft1) > 0) {
                                            foreach ($monthsemesterLeft1 as $value) {

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
                                            ->whereHas('paymentForm', function ($query) use ($endMonth) {
                                                $query->where('StartDate', '>', $endMonth);
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
                                            $result = $money / $totalSchoolDay * ($daysLeftInMonth - $totalDayWeekend + $totalSchoolDayLeft);
                                        }

                                    case 'THANG':
                                        $result = ($daysLeftInMonth - $totalDayWeekend) * $money;
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
                            }
                            break;
                    }
                }
            }

            $data[] = [
                "id" => $detail->id,
                "feeId" => $detail->feeId,
                "paymentFormId" => $detail->paymentFormId,
                'money' => $result,
            ];
        }
        return [
            'data' => $data,
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
}
