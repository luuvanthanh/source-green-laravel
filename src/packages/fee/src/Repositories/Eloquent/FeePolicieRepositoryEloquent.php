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
        $fee = \GGPHP\Fee\Models\Fee::findOrFail($attributes['feeId']);
        $paymentForm = \GGPHP\Fee\Models\PaymentForm::findOrFail($attributes['paymentFormId']);
        $feePolicie = FeePolicie::where('SchoolYearId', $attributes['schooleYearId'])->first();
        $schooleYear = \GGPHP\Fee\Models\SchoolYear::findOrFail($attributes['schooleYearId']);

        $dayAdmission = $attributes['dayAdmission'];

        $totalMonth = $schooleYear->TotalMonth;
        $month = 'Tháng ' . Carbon::parse($dayAdmission)->format('m') . '/' . Carbon::parse($dayAdmission)->format('Y');

        $timetable = $schooleYear->timetable->where('Month', $month);
        $weekDayAdmission = $schooleYear->timetable->where('Month', $month)->where('StartDate', '<=', $dayAdmission)->where('EndDate', '>=', $dayAdmission)->first();

        $totalMonthsemester1 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
            ->whereHas('paymentForm', function ($query) {
                $query->where('Code', 'HOCKY1');
            })->count();

        $totalMonthsemester2 = \GGPHP\Fee\Models\ChangeParameterDetail::where('ChangeParameterId', $schooleYear->changeParameter->Id)
            ->whereHas('paymentForm', function ($query) {
                $query->where('Code', 'HOCKY2');
            })->count();

        $totalWeekStudyInMonth = count($timetable);

        $remainingWeek = $totalWeekStudyInMonth - $weekDayAdmission->Week + 1;

        $monthAdmission = Carbon::parse($dayAdmission)->setDay(1);
        $monthStart = Carbon::parse($schooleYear->StartDate)->setDay(1);

        $monthStudied = $monthAdmission->diffInMonths($monthStart) + 1;
        $money = 0;
        switch ($fee->Type) {
            case 'HP':
                $feeDetail = $feePolicie->feeDetail()
                    ->where('ClassTypeId', $attributes['classTypeId'])
                    ->where('PaymentFormId', $attributes['paymentFormId'])->first();

                switch ($attributes['student']) {
                    case 'new':
                        $money = $feeDetail->NewStudent;
                        break;
                    case 'old':
                        $money = $feeDetail->OldStudent;
                        break;
                }
                break;
            case 'TIENAN':
                $feeDetail = $feePolicie->moneyMeal()
                    ->where('ClassTypeId', $attributes['classTypeId'])
                    ->where('PaymentFormId', $attributes['paymentFormId'])->first();

                $money = $feeDetail->Money;

                break;
            case 'KHAC':
                $feeDetail = $feePolicie->otherMoneyDetail()
                    ->where('ClassTypeId', $attributes['classTypeId'])
                    ->where('FeeId', $attributes['feeId'])
                    ->where('PaymentFormId', $attributes['paymentFormId'])->first();

                $money = $feeDetail->Money;
                break;
        }

        $result = 0;
        switch ($paymentForm->Code) {
            case 'HOCKY1':
                if ($totalMonthsemester1 > 0) {
                    $result = $money / $totalMonthsemester1 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester1 - $monthStudied);
                }
                break;
            case 'HOCKY2':
                if ($totalMonthsemester2 > 0) {

                    $result = $money / $totalMonthsemester2 * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonthsemester2 - $monthStudied);
                }
                break;
            case 'NAM':
                $result = $money / $totalMonth * (($remainingWeek / $totalWeekStudyInMonth) + $totalMonth - $monthStudied);
                break;
            case 'THANG':
                $result = $money * ($remainingWeek / $totalWeekStudyInMonth);
                break;
        }

        return [
            'data' => [
                'dayAdmission' => $attributes['dayAdmission'],
                'paymentForm' => $paymentForm->Name,
                'totalMonth' => $totalMonth,
                'totalMonthsemester1' => $totalMonthsemester1,
                'totalMonthsemester2' => $totalMonthsemester2,
                'remainingWeek' => $remainingWeek,
                'totalWeekStudyInMonth' => $totalWeekStudyInMonth,
                'monthStudied' => $monthStudied,
                'money' => $result,
                'totalMoney' => $money,
            ],
        ];
    }
}
