<?php

namespace GGPHP\ManualCalculation\Repositories\Eloquent;

use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;
use GGPHP\Category\Models\Holiday;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ManualCalculation\Models\ManualCalculation;
use GGPHP\ManualCalculation\Presenters\ManualCalculationPresenter;
use GGPHP\ManualCalculation\Repositories\Contracts\ManualCalculationRepository;
use GGPHP\Users\Models\User;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ManualCalculationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ManualCalculationRepositoryEloquent extends CoreRepositoryEloquent implements ManualCalculationRepository
{
    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Container $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ManualCalculation::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return ManualCalculationPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all Magnetic Card
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function getAll(array $attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereHas('manualCalculation', function ($query) use ($attributes) {
            if (!empty($attributes['type'])) {
                $query->where('Type', $attributes['type']);
            }

            if (!empty($attributes['employeeId'])) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            }

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('Date', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                    ->whereDate('Date', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
            };
        })->with(['manualCalculation' => function ($query) use ($attributes) {
            if (!empty($attributes['type'])) {
                $query->where('Type', $attributes['type']);
            }

            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('Date', '>=', Carbon::parse($attributes['startDate'])->format('Y-m-d'))
                    ->whereDate('Date', '<=', Carbon::parse($attributes['endDate'])->format('Y-m-d'));
            };
        }]);

        if (!empty($attributes['key'])) {
            $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->whereLike('FullName', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $manualCalculation = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $manualCalculation = $this->employeeRepositoryEloquent->get();
        }

        return $manualCalculation;
    }

    public function create(array $attributes)
    {
        $date = Carbon::parse($attributes['date'])->format('Y-m-d');

        if (!empty($attributes['type'])) {
            $attributes['type'] = ManualCalculation::TYPE[$attributes['type']];
        }

        $manualCalculation = $this->model->where('EmployeeId', $attributes['employeeId'])->whereDate('Date', $date)->first();

        if (is_null($manualCalculation)) {
            $manualCalculation = $this->model->create($attributes);
        } else {
            $manualCalculation->update($attributes);
        }

        if (!is_null($manualCalculation) && $attributes['type'] == ManualCalculation::TYPE['N']) {
            $manualCalculation->delete();
        }

        return $this->parserResult($manualCalculation);
    }

    public function copyManualCalculation(array $attributes)
    {
        $model = $this->model->whereIn('EmployeeId', $attributes['employeeId'])
            ->whereDate('Date', '>=', $attributes['startDate'])
            ->whereDate('Date', '<=', $attributes['endDate'])->get();

        $newDate = Carbon::parse($attributes['startDate'])->format('d');

        foreach ($model as $value) {

            $dateMonth = Carbon::parse($attributes['month']);
            $date = Carbon::parse($value->Date)->format('d');
            $newDate = $dateMonth->format('Y-m') . '-' . $date;

            if ($date >= $newDate) {
                $newDate =  $dateMonth->subMonth()->format('Y-m') . '-' . $date;
            }

            if ($this->isValidDate($newDate) == false) {
                continue;
            }

            $checkDay = Carbon::parse($newDate);

            if ($checkDay->dayOfWeek == Carbon::SUNDAY || $checkDay->dayOfWeek == Carbon::SATURDAY) {
                continue;
            }

            $data = [
                'employeeId' => $value->EmployeeId,
                'date' => $newDate,
                'type' => array_search($value->Type, ManualCalculation::TYPE)
            ];

            $this->create($data);
        }

        return $this->parserResult($model);
    }

    function isValidDate($string, $format = 'Y-m-d')
    {
        $dateTime = DateTime::createFromFormat($format, $string);

        return $dateTime && $dateTime->format($format) == $string;
    }

    public function fastManualCalculation(array $attributes)
    {
        DB::beginTransaction();
        try {
            foreach ($attributes['data'] as $value) {

                $year = Carbon::parse(end($value['listOfDate'])['date'])->format('Y');
                $holiday = Holiday::where('Name', $year)->first();

                if (!is_null($holiday)) {
                    foreach ($holiday->holidayDetail as $valueHolidayDetail) {

                        $start_date = date_create($valueHolidayDetail->StartDate);
                        $end_date   = date_create($valueHolidayDetail->EndDate);
                        $interval = DateInterval::createFromDateString('1 day');
                        $dateRange = new DatePeriod($start_date, $interval, $end_date);

                        foreach ($dateRange as $date) {

                            if (array_search($date->format('Y-m-d'), array_column($value['listOfDate'], 'date'))) {
                                $location = array_search($date->format('Y-m-d'), array_column($value['listOfDate'], 'date'));
                                unset($value['listOfDate'][$location]);
                            }
                        }
                    }
                }

                foreach ($value['listOfDate'] as $data) {
                    $data['employeeId'] = $value['employeeId'];
                    $result = $this->create($data);
                }
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return $result;
    }
}
