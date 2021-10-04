<?php

namespace GGPHP\ShiftSchedule\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ShiftSchedule\Models\DivisionShift;
use GGPHP\ShiftSchedule\Presenters\DivisionShiftPresenter;
use GGPHP\ShiftSchedule\Repositories\Contracts\DivisionShiftRepository;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\Users\Models\User;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DivisionShiftRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DivisionShiftRepositoryEloquent extends CoreRepositoryEloquent implements DivisionShiftRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'CreationTime',
    ];

    protected $scheduleRepositoryEloquent;

    public function __construct(ScheduleRepositoryEloquent $scheduleRepositoryEloquent, Application $app)
    {
        parent::__construct($app);
        $this->scheduleRepositoryEloquent = $scheduleRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return DivisionShift::class;
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
        return DivisionShiftPresenter::class;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $afterStartDate = Carbon::parse($attributes['startDate'])->subDay()->format('Y-m-d');
            $divisionShiftOld = DivisionShift::where('DivisionId', $attributes['divisionId'])->orderBy('CreationTime', 'DESC')->first();

            if (!is_null($divisionShiftOld)) {
                $divisionShiftOld->update([
                    'EndDate' => $afterStartDate
                ]);
            }

            $divisionShift = DivisionShift::create($attributes);

            $listUserByDivision = User::whereHas('positionLevel', function ($q) use ($attributes) {
                $q->where('DivisionId', $attributes['divisionId']);
                $now = Carbon::now()->format('Y-m-d');
                $q->where(function ($q2) use ($now) {
                    $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                        ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
                });
            })->get();

            $dataSchedule = [
                'shiftId' => $attributes['shiftId'],
                'startDate' => $attributes['startDate'],
                'endDate' => $attributes['endDate'],
                'interval' => 1,
                'repeatBy' => 'daily',
            ];

            foreach ($listUserByDivision as $key => $value) {
                $dataSchedule['employeeId'] = $value->Id;
                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($divisionShift->Id);
    }

    public function update(array $attributes, $id)
    {
        $divisionShift = DivisionShift::findOrFail($id);
        \DB::beginTransaction();
        try {
            $afterStartDate = Carbon::parse($attributes['startDate'])->subDay()->format('Y-m-d');
            $divisionShiftOld = DivisionShift::where('DivisionId', $attributes['divisionId'])->orderBy('CreationTime', 'DESC')->first();

            if (!is_null($divisionShiftOld)) {
                $divisionShiftOld->update([
                    'EndDate' => $afterStartDate
                ]);
            }

            $divisionShift->update($attributes);

            $divisionId = empty($attributes['divisionId']) ? $attributes['divisionId'] : $divisionShift->DivisionId;
            $listUserByDivision = User::whereHas('positionLevel', function ($q) use ($divisionId) {
                $q->where('DivisionId', $divisionId);
                $now = Carbon::now()->format('Y-m-d');
                $q->where(function ($q2) use ($now) {
                    $q2->where([['StartDate', '<=', $now], ['EndDate', '>=', $now]])
                        ->orWhere([['StartDate', '<=', $now], ['EndDate', null]]);
                });
            })->get();

            $dataSchedule = [
                'shiftId' => empty($attributes['shiftId']) ? $attributes['shiftId'] : $divisionShift->ShiftId,
                'startDate' => empty($attributes['startDate']) ? $attributes['startDate'] : $divisionShift->StartDate,
                'endDate' => empty($attributes['endDate']) ? $attributes['endDate'] : $divisionShift->EndDate,
                'interval' => 1,
                'repeatBy' => 'daily',
            ];

            foreach ($listUserByDivision as $key => $value) {
                $dataSchedule['employeeId'] = $value->Id;
                $this->scheduleRepositoryEloquent->createOrUpdate($dataSchedule);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($id);
    }

    public function getDivisionShift(array $attributes)
    {
        if (!empty($attributes['employeeCreateId'])) {
            $this->model = $this->model->where('EmployeeCreateId', $attributes['employeeCreateId']);
        }

        if (!empty($attributes['divisionId'])) {
            $this->model = $this->model->where('DivisionId', $attributes['divisionId']);
        }
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('division', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            });
        }

        if (!empty($attributes['StartDate']) && !empty($attributes['EndDate'])) {
            $this->model = $this->model->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                ->orWhere([['StartDate', '>', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<', $attributes['endDate']]]);
        }

        if (!empty($attributes['limit'])) {
            $divisionShift = $this->paginate($attributes['limit']);
        } else {
            $divisionShift = $this->get();
        }

        return $divisionShift;
    }
}
