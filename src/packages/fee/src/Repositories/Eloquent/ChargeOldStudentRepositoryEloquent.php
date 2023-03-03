<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use CloudCreativity\LaravelJsonApi\Utils\Arr;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Fee\Models\ClassType;
use GGPHP\Fee\Models\DetailPaymentAccountant;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Fee\Presenters\ChargeOldStudentPresenter;
use GGPHP\Fee\Repositories\Contracts\ChargeOldStudentRepository;
use GGPHP\Fee\Services\ChargeOldStudentService;
use GGPHP\Tariff\PaymentPlan\Models\PaymentPlan;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class ChargeOldStudentRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ChargeOldStudentRepositoryEloquent extends CoreRepositoryEloquent implements ChargeOldStudentRepository
{
    const SEMESTER1 = 'HOCKY1';
    const SEMESTER2 = 'HOCKY2';

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
        return ChargeOldStudent::class;
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
        return ChargeOldStudentPresenter::class;
    }

    public function filterChargeOldStudent(array $attributes)
    {
        if (!empty($attributes['nameStudent'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['nameStudent']);
            });
        }

        if (!empty($attributes['month'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where('StartDate', '<=', $attributes['month'])->where('EndDate', '>=', $attributes['month']);
            });
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->model = $this->model->where('SchoolYearId', $attributes['schoolYearId']);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->model = $this->model->whereIn('StudentId', $studentId);
        }

        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->whereHas('schoolYear', function ($query) use ($attributes) {
                $query->where(function ($q) use ($attributes) {
                    $q->where([['YearFrom', '<=', $attributes['from']], ['YearTo', '>=', $attributes['to']]])
                        ->orWhere([['YearFrom', '>', $attributes['from']], ['YearFrom', '<=', $attributes['to']]])
                        ->orWhere([['YearTo', '>=', $attributes['from']], ['YearTo', '<', $attributes['to']]]);
                });
            });
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                $q->whereHas('classStudent', function ($query) use ($attributes) {
                    $query->whereHas('classes', function ($queryBranch) use ($attributes) {
                        $queryBranch->where('BranchId', $attributes['branchId']);
                    });
                });
            });
        }

        if (!empty($attributes['classId'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->where('ClassId', $attributes['classId']);
            });
        }

        //dùng để gọi bên biểu phí, lấy những học sinh chưa tạo biểu phí
        if (
            !empty($attributes['month_payment_plan']) && !empty($attributes['is_payment_plan'])
            && !empty($attributes['branchId']) && !empty($attributes['schoolYearId']) && !empty($attributes['classId'])
        ) {
            $paymentPlans = PaymentPlan::where('BranchId', $attributes['branchId'])->whereMonth('ChargeMonth', Carbon::parse($attributes['month_payment_plan']))
                ->where('SchoolYearId', $attributes['schoolYearId'])->where('ClassId', $attributes['classId'])->get();

            $arrStudentId = $paymentPlans->map((function ($paymentPlan) {
                return $paymentPlan->paymentPlanDetail->map(function ($item) {
                    return $item->StudentId;
                });
            }));
           
            $this->model = $this->model->whereNotIn('StudentId', $arrStudentId->flatten(1)->toArray());
        }

        if (!empty($attributes['limit'])) {
            $paymentForm = $this->paginate($attributes['limit']);
        } else {
            $paymentForm = $this->get();
        }

        return $paymentForm;
    }

    public function create(array $attributes)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::create($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expectedToCollectMoney'], 'total_money_month'));
            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($chargeStudent);
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $chargeStudent = ChargeOldStudent::findOrFail($id);

            $chargeStudent->update($attributes);

            $totalMoney = 0;
            if (!empty($attributes['tuition'])) {
                $chargeStudent->tuition()->delete();

                foreach ($attributes['tuition'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }
                    $chargeStudent->tuition()->create($value);
                }
            }

            $totalMoney = array_sum(array_column($attributes['expectedToCollectMoney'], 'total_money_month'));
            $chargeStudent->update(['TotalMoney' => $totalMoney]);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function chargeOldStudentDetailPayment(array $attributes)
    {
        $dataCrm = [];
        foreach ($attributes['data'] as $value) {
            $chargeOldStudent = ChargeOldStudent::find($value['chargeOldStudenId']);
            $chargeOldStudent->update(['PaymentStatus' => ChargeOldStudent::PAYMENT_STATUS[$value['paymentStatus']]]);

            foreach ($value['detail'] as $valueDetail) {
                $valueDetail['ChargeOldStudentId'] = $chargeOldStudent->Id;
                DetailPaymentAccountant::create($valueDetail);
            }

            switch ($chargeOldStudent->PaymentStatus) {
                case '1':
                    $status = 'UNPAID';
                    break;
                case '2':
                    $status = 'PAYING';
                    break;
                case '3':
                    $status = 'PAID';
                    break;
                default:
            }

            if (!is_null($chargeOldStudent->ChargeStudentIdCrm)) {
                $dataCrm[] = [
                    'charge_student_id' => $chargeOldStudent->ChargeStudentIdCrm,
                    'status' => $status
                ];
            }
        }

        if (!empty($dataCrm)) {
            ChargeOldStudentService::updateStatusStudentCrm($dataCrm);
        }

        return parent::find($chargeOldStudent->Id);
    }

    public function getMonthAgeDetailStudent(array $attributes): array
    {
        $schoolYear = SchoolYear::find($attributes['schoolYearId']);
        $student = Student::find($attributes['studentId']);

        foreach ($schoolYear->changeParameter->changeParameterDetail as $key => $value) {
            $now = Carbon::parse($student->DayOfBirth);
            $valueDate = Carbon::parse($value->Date);
            $ageMonth = (($valueDate->format('Y') - $now->format('Y')) * 12) + ($valueDate->format('m') - $now->format('m'));

            $classType = ClassType::where('From', '<=', $ageMonth)->where('To', '>=', $ageMonth)->first();

            $data['countClassType'][] = !empty($classType) ? $classType->Id : 0;
            $data['detailStudent'][$value->StartDate] = [
                'month' => $value->StartDate,
                'ageMont' => (int) $ageMonth,
                'classType' => !empty($classType->Name) ? $classType->Name : null,
                'classTypeId' => !empty($classType) ? $classType->Id : null,
                'date' => $value->Date
            ];
            $data[$classType->Id][] = $classType->Id;
        }

        $data['countClassType'] = array_values(array_unique($data['countClassType']));
        return $data;
    }

    public function getMonthAgeDetailStudentBySchoolYear($schoolYear, $student, $dayAdmission, $allDateOfSchoolYear): array
    {
        $data['dataClassType'] = [];
        $data['dataPaymentForm'] = [];
        $totalMonthCaseTwo = 0;
        $numberMonthVariableTwo = 0;
        foreach ($schoolYear->changeParameter->changeParameterDetail as $key => $value) {
            $now = Carbon::parse($student->DayOfBirth);
            $valueDate = Carbon::parse($value->Date);
            $ageMonth = (($valueDate->format('Y') - $now->format('Y')) * 12) + ($valueDate->format('m') - $now->format('m'));

            $classType = ClassType::where('From', '<=', $ageMonth)->where('To', '>=', $ageMonth)->first();
            if (is_null($classType)) {
                continue;
            }
            $data['countClassType'][] = !empty($classType) ? $classType->Id : 0;
            $dateOfMonth = [];
            if (!array_key_exists($classType->Id, $data['dataClassType'])) {
                if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($value->EndDate)->format('Y-m')) {
                    foreach ($allDateOfSchoolYear as $key => $dateOfSchoolYear) {
                        if ($dayAdmission > $key && Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                            //số ngày trong tháng trước lúc bé nhập học
                            $dateOfMonth[] = $dateOfSchoolYear;
                        }
                    }
                }

                $data['dataClassType'][$classType->Id] = [
                    'classTypeId' => !empty($classType) ? $classType->Id : null,
                    'classType' => !empty($classType->Name) ? $classType->Name : null,
                    'numberMonth' => $value->FullMonth,
                    'schoolDay' => $value->SchoolDay,
                    'numberMonthCaseTwo' => 1,
                    'dateOfMonth' => !empty($dateOfMonth) ? array_sum($dateOfMonth) : 0
                ];

                $numberMonthVariableOne = $data['dataClassType'][$classType->Id]['numberMonth'];
            } else {
                $data['dataClassType'][$classType->Id]['numberMonth'] += $value->FullMonth;
                $data['dataClassType'][$classType->Id]['numberMonthCaseTwo'] += 1;
                $data['dataClassType'][$classType->Id]['schoolDay'] += $value->SchoolDay;
                if (Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($value->EndDate)->format('Y-m')) {
                    foreach ($allDateOfSchoolYear as $key => $dateOfSchoolYear) {
                        if ($dayAdmission > $key && Carbon::parse($dayAdmission)->format('Y-m') == Carbon::parse($key)->format('Y-m')) {
                            //số ngày trong tháng trước lúc bé nhập học
                            $dateOfMonth[] = $dateOfSchoolYear;
                        }
                    }
                }

                $data['dataClassType'][$classType->Id]['dateOfMonth'] += array_sum($dateOfMonth);
                $numberMonthVariableTwo +=  $value->FullMonth;
            }

            if ($value->paymentForm->Code == self::SEMESTER1 || $value->paymentForm->Code == self::SEMESTER2) {
                if (!array_key_exists($value->paymentForm->Code, $data['dataPaymentForm'])) {
                    $data['dataPaymentForm'][$value->paymentForm->Code] = [
                        'paymentFormCode' => $value->paymentForm->Code,
                        'paymentFormId' => $value->paymentForm->Id,
                        'numberMonthInSemester' => 1,
                        'dataClassType' => []
                    ];

                    if (!array_key_exists($classType->Id, $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'])) {
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id] = [
                            'classTypeId' => !empty($classType) ? $classType->Id : null,
                            'classType' => !empty($classType->Name) ? $classType->Name : null,
                            'numberClassType' => 1,
                            'schoolDay' => $value->SchoolDay,
                        ];
                    } else {
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id]['numberClassType'] += 1;
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id]['schoolDay'] +=  $value->SchoolDay;
                    }
                } else {
                    if (!array_key_exists($classType->Id, $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'])) {
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id] = [
                            'classTypeId' => !empty($classType) ? $classType->Id : null,
                            'classType' => !empty($classType->Name) ? $classType->Name : null,
                            'numberClassType' => 1,
                            'schoolDay' => $value->SchoolDay,
                        ];
                    } else {
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id]['numberClassType'] += 1;
                        $data['dataPaymentForm'][$value->paymentForm->Code]['dataClassType'][$classType->Id]['schoolDay'] +=  $value->SchoolDay;
                    }

                    $data['dataPaymentForm'][$value->paymentForm->Code]['numberMonthInSemester'] += 1;
                }
            }

            $data['detailStudent'][$value->StartDate] = [
                'month' => $value->StartDate,
                'ageMont' => (int) $ageMonth,
                'classType' => !empty($classType->Name) ? $classType->Name : null,
                'classTypeId' => !empty($classType) ? $classType->Id : null,
                'date' => $value->Date,
                'schoolDay' => $value->SchoolDay,
                'fullMonth' => $value->FullMonth,
                'paymentFormCode' => $value->paymentForm->Code,
                'idPaymentForm' => $value->paymentForm->Id,
                'actualWeek' => $value->ActualWeek
            ];
            $data[$classType->Id][] = $value->Id;
            $totalMonthCaseTwo += 1;
        }

        $data['dataClassType']['totalMonth'] = $numberMonthVariableOne + $numberMonthVariableTwo;
        $data['dataClassType']['totalMonthCaseTwo'] = $totalMonthCaseTwo;
        $data['countClassType'] = array_values(array_unique($data['countClassType']));

        return $data;
    }
}
