<?php

namespace GGPHP\YoungAttendance\ShiftSchedule\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Schedule;
use GGPHP\YoungAttendance\ShiftSchedule\Models\Shift;
use GGPHP\YoungAttendance\ShiftSchedule\Models\ShiftDetail;
use GGPHP\YoungAttendance\ShiftSchedule\Presenters\ShiftPresenter;
use GGPHP\YoungAttendance\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use GGPHP\YoungAttendance\ShiftSchedule\Services\ShiftDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ShiftRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ShiftRepositoryEloquent extends CoreRepositoryEloquent implements ShiftRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'ShiftCode' => 'like',
        'Status',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Shift::class;
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
        return ShiftPresenter::class;
    }

    /**
     * Override method create to add owners
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function create(array $attributes)
    {
        $attributes['Status'] = Shift::ON;
        \DB::beginTransaction();
        try {
            $shift = $this->model()::create($attributes);

            ShiftDetailServices::add($shift->Id, $attributes['time']);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
        }

        return parent::find($shift->Id);
    }

    /**
     * Override method update to add owners
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function update(array $attributes, $id)
    {
        $shift = $this->model::find($id);
        $shift = $shift->update($attributes);

        if (!empty($attributes['time'])) {
            ShiftDetailServices::update($id, $attributes['time']);
        }

        return parent::find($id);
    }

    /**
     * Active Status Shift
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function activeStatusShift(array $attributes, $id)
    {
        $shift = $this->model::find($id);
        $shift = $shift->update(['Status' => $attributes['status']]);

        return parent::find($id);
    }

    /**
     * Override method update to delete owners
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function delete($id)
    {
        Schedule::where('ShiftId', $id)->delete();
        ShiftDetail::where('ShiftId', $id)->delete();

        return parent::delete($id);
    }

    public function getShift(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->orWhereLike('ShiftCode', $attributes['key']);
            $this->model = $this->model->orWhereLike('Description', $attributes['key']);
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model->where('branchId', $attributes['branchId']);
        }

        if (!empty($attributes['status'])) {
            $this->model = $this->model->where('Status', $attributes['status']);
        }

        if (!empty($attributes['limit'])) {
            $result = $this->paginate($attributes['limit']);
        } else {
            $result = $this->get();
        }

        return $result;
    }
}
