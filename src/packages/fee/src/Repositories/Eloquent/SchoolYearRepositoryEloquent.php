<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\SchoolYear;
use GGPHP\Fee\Presenters\SchoolYearPresenter;
use GGPHP\Fee\Repositories\Contracts\SchoolYearRepository;
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
}
