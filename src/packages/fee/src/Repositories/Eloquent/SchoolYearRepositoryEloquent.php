<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Jobs\CreateSchoolYearCrmJob;
use GGPHP\Fee\Jobs\UpdateSchoolYearCrmJob;
use GGPHP\Fee\Models\PaymentForm;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Fee\Presenters\SchoolYearPresenter;
use GGPHP\Fee\Repositories\Contracts\SchoolYearRepository;
use GGPHP\Fee\Services\SchoolYearCrmService;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class SchoolYearRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SchoolYearRepositoryEloquent extends CoreRepositoryEloquent implements SchoolYearRepository
{
    const CODE_CONVERT = [
        'NAM' => 'năm',
        'THANG' => 'tháng',
        'HOCKY1_HOCKY2' => 'học kỳ 1 và học kỳ 2',
        'HOCKY1' => 'học kỳ 1',
        'HOCKY2' => 'học kỳ 2'

    ];

    const PAYMENTFORM_CONVERT = 'hình thức';

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
        return SchoolYear::class;
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
        return SchoolYearPresenter::class;
    }

    public function filterSchoolYear(array $attributes)
    {
        if (!empty($attributes['from']) && !empty($attributes['to'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->where([['YearFrom', '<=', $attributes['from']], ['YearTo', '>=', $attributes['to']]])
                    ->orWhere([['YearFrom', '>', $attributes['from']], ['YearFrom', '<=', $attributes['to']]])
                    ->orWhere([['YearTo', '>=', $attributes['from']], ['YearTo', '<', $attributes['to']]]);
            });
        }

        if (!empty($attributes['schoolYearCrmId'])) {
            $this->model = $this->model->where('SchoolYearCrmId', null);
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
            $schoolYear = SchoolYear::create($attributes);
            $totalMonth = 0;
            $dataTimeTable = [];

            if (!empty($attributes['fixedParameter'])) {
                foreach ($attributes['fixedParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->fixedParameter()->create($value);
                }
            }

            if (!empty($attributes['changeParameter'])) {

                foreach ($attributes['changeParameter'] as $key => $item) {
                    $newkey = dashesToCamelCase($key, true);

                    if ($key != $newkey) {
                        $attributes['changeParameter'][$newkey] = $attributes['changeParameter'][$key];
                        unset($attributes['changeParameter'][$key]);
                    }
                }

                $changeParameter = $schoolYear->changeParameter()->create($attributes['changeParameter']);

                foreach ($attributes['changeParameter']['Detail'] as $key => $value) {

                    $value['changeParameterId'] = $changeParameter->Id;
                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $totalMonth += $value['FullMonth'];

                    $value['StartDate'] = Carbon::parse($value['StartDate'])->format('Y-m-d');
                    $value['EndDate'] = Carbon::parse($value['EndDate'])->format('Y-m-d');
                    $changeParameter->changeParameterDetail()->create($value);
                    $ranges = $this->rangesOfWeek($value);

                    $month = 'Tháng ' . Carbon::parse($value['EndDate'])->format('m') . '/' . Carbon::parse($value['EndDate'])->format('Y');

                    for ($i = 0; $i < count($ranges); $i++) {
                        $dataTimeTable[] = [
                            'SchoolYearId' => $schoolYear->Id,
                            'Month' => $month,
                            'Week' => $i + 1,
                            'StartDate' => $ranges[$i]['start'],
                            'EndDate' => $ranges[$i]['end'],
                        ];
                    }
                }

                foreach ($dataTimeTable as $value) {
                    \GGPHP\Fee\Models\Timetable::create($value);
                }

                $schoolYear->update(['TotalMonth' => $totalMonth]);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        dispatch(new CreateSchoolYearCrmJob($schoolYear->refresh(), request()->bearerToken()));

        return parent::parserResult($schoolYear);
    }

    public function update(array $attributes, $id)
    {
        $schoolYear = SchoolYear::findOrFail($id);

        DB::beginTransaction();
        try {
            $schoolYear->update($attributes);

            $totalMonth = 0;
            $dataTimeTable = [];

            if (!empty($attributes['fixedParameter'])) {
                $schoolYear->fixedParameter()->delete();

                foreach ($attributes['fixedParameter'] as $value) {

                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $schoolYear->fixedParameter()->create($value);
                }
            }

            if (!empty($attributes['changeParameter'])) {
                $schoolYear->changeParameter()->delete();

                foreach ($attributes['changeParameter'] as $key => $item) {
                    $newkey = dashesToCamelCase($key, true);

                    if ($key != $newkey) {
                        $attributes['changeParameter'][$newkey] = $attributes['changeParameter'][$key];
                        unset($attributes['changeParameter'][$key]);
                    }
                }

                $changeParameter = $schoolYear->changeParameter()->create($attributes['changeParameter']);

                foreach ($attributes['changeParameter']['Detail'] as $key => $value) {
                    $value['changeParameterId'] = $changeParameter->Id;
                    foreach ($value as $key => $item) {
                        $newkey = dashesToCamelCase($key, true);

                        if ($key != $newkey) {
                            $value[$newkey] = $value[$key];
                            unset($value[$key]);
                        }
                    }

                    $totalMonth += $value['FullMonth'];

                    $value['StartDate'] = Carbon::parse($value['StartDate'])->format('Y-m-d');
                    $value['EndDate'] = Carbon::parse($value['EndDate'])->format('Y-m-d');
                    $changeParameter->changeParameterDetail()->create($value);
                    $ranges = $this->rangesOfWeek($value);

                    $month = 'Tháng ' . Carbon::parse($value['EndDate'])->format('m') . '/' . Carbon::parse($value['EndDate'])->format('Y');

                    $schoolYear->timetable()->delete();

                    for ($i = 0; $i < count($ranges); $i++) {
                        $dataTimeTable[] = [
                            'SchoolYearId' => $schoolYear->Id,
                            'Month' => $month,
                            'Week' => $i + 1,
                            'StartDate' => $ranges[$i]['start'],
                            'EndDate' => $ranges[$i]['end'],
                        ];
                    }
                }

                foreach ($dataTimeTable as $value) {
                    \GGPHP\Fee\Models\Timetable::create($value);
                }

                $schoolYear->update(['TotalMonth' => $totalMonth]);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        dispatch(new UpdateSchoolYearCrmJob($schoolYear->refresh(), $schoolYear->SchoolYearCrmId, request()->bearerToken()));

        return parent::find($id);
    }

    public function rangesOfWeek($value)
    {

        $start = new \DateTime($value['StartDate']);
        $end = new \DateTime($value['EndDate'] . '23:59');
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($start, $interval, $end);

        $weekNumber = 0;
        $weeks = array();
        foreach ($dateRange as $date) {
            $weeks[$weekNumber][] = $date->format('Y-m-d');

            if ($date->format('w') == 0) {
                $weekNumber++;
            }
        }
        $ranges = array_map(function ($week) {
            return [
                'start' => $week[0],
                'end' => end($week),
            ];
        }, $weeks);

        return $ranges;
    }

    public function updateSchoolYearCrm(array $attributes)
    {
        foreach ($attributes as $item) {
            $schoolYear = SchoolYear::findOrfail($item['school_year_clover_id']);

            $schoolYear->update(['SchoolYearCrmId' => $item['id']]);
        }
    }

    public function updateAllIsCheckInSchoolYear()
    {
        $now = now()->format('Y-m-d');

        SchoolYear::whereNotIn('Id', function ($query) use ($now) {
            $query->select('Id')->from('fee.SchoolYears')->whereDate('StartDate', '<=', $now)->whereDate('EndDate', '>=', $now)->where('IsCheck', true);
        })->update(['IsCheck' => false]);
    }

    public function updateIsCheckSchoolYear($attributes, $id)
    {
        $schoolYear = SchoolYear::findOrFail($id);
        $updateSchoolYear = !is_null($schoolYear) ? $schoolYear->update($attributes) : null;

        return parent::find($schoolYear->Id);
    }

    public function getDetailSchoolYear($attributes): array
    {
        $schoolYears = $this->model->get();

        foreach ($schoolYears as $key => $schoolYear) {
            foreach ($schoolYear->fixedParameter as $value) {
                switch ($value->paymentForm->Code) {
                    case PaymentForm::CODE['NAM']:
                        $changeParameterDetail = $schoolYear->changeParameter->changeParameterDetail->ToArray();
                        $data[] = [
                            'paymentForm' => self::CODE_CONVERT['NAM'],
                            'paymentFormId' => $value->PaymentFormId,
                            'startDate' => $schoolYear->StartDate,
                            'endDate' => $schoolYear->EndDate,
                            'totalOfMonth' => array_sum(array_column($changeParameterDetail, 'FullMonth')),
                            'schoolYear' => $schoolYear->YearFrom . '-' . $schoolYear->YearTo
                        ];
                        break;
                    case PaymentForm::CODE['HOCKY1']:
                        $changeParameterDetail = $schoolYear->changeParameter->changeParameterDetail()->where('PaymentFormId', $value->PaymentFormId)->get()->ToArray();
                        $data[] = [
                            'paymentForm' => self::CODE_CONVERT['HOCKY1'],
                            'paymentFormId' => $value->PaymentFormId,
                            'startDate' => current($changeParameterDetail)['StartDate'],
                            'endDate' => end($changeParameterDetail)['EndDate'],
                            'totalOfMonth' => array_sum(array_column($changeParameterDetail, 'FullMonth')),
                            'schoolYear' => $schoolYear->YearFrom . '-' . $schoolYear->YearTo
                        ];
                        break;
                    case PaymentForm::CODE['HOCKY2']:
                        $changeParameterDetail = $schoolYear->changeParameter->changeParameterDetail()->where('PaymentFormId', $value->PaymentFormId)->get()->ToArray();
                        $data[] = [
                            'paymentForm' => self::CODE_CONVERT['HOCKY2'],
                            'paymentFormId' => $value->PaymentFormId,
                            'startDate' => current($changeParameterDetail)['StartDate'],
                            'endDate' => end($changeParameterDetail)['EndDate'],
                            'totalOfMonth' => array_sum(array_column($changeParameterDetail, 'FullMonth')),
                            'schoolYear' => $schoolYear->YearFrom . '-' . $schoolYear->YearTo
                        ];
                        break;
                    case PaymentForm::CODE['HOCKY1_HOCKY2']:
                        $changeParameterDetail = $schoolYear->changeParameter->changeParameterDetail()->where('PaymentFormId', $value->PaymentFormId)->get()->ToArray();
                        $data[] = [
                            'paymentForm' => self::CODE_CONVERT['HOCKY1_HOCKY2'],
                            'paymentFormId' => $value->PaymentFormId,
                            'startDate' => current($changeParameterDetail)['StartDate'],
                            'endDate' => end($changeParameterDetail)['EndDate'],
                            'totalOfMonth' => array_sum(array_column($changeParameterDetail, 'FullMonth')),
                            'schoolYear' => $schoolYear->YearFrom . '-' . $schoolYear->YearTo
                        ];
                        break;
                    case PaymentForm::CODE['THANG']:
                        $changeParameterDetail = $schoolYear->changeParameter->changeParameterDetail()->where('PaymentFormId', $value->PaymentFormId)->get()->ToArray();
                        $data[] = [
                            'paymentForm' => self::CODE_CONVERT['THANG'],
                            'paymentFormId' => $value->PaymentFormId,
                            'startDate' => current($changeParameterDetail)['StartDate'],
                            'endDate' => end($changeParameterDetail)['EndDate'],
                            'totalOfMonth' => array_sum(array_column($changeParameterDetail, 'FullMonth')),
                            'schoolYear' => $schoolYear->YearFrom . '-' . $schoolYear->YearTo
                        ];
                        break;
                }
            }
        }

        return array_values($data);
    }
}
