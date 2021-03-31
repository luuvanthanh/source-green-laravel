<?php

namespace GGPHP\ShiftSchedule\Repositories\Eloquent;

use GGPHP\ShiftSchedule\Models\Schedule;
use GGPHP\ShiftSchedule\Models\Shift;
use GGPHP\ShiftSchedule\Models\ShiftDetail;
use GGPHP\ShiftSchedule\Presenters\ShiftPresenter;
use GGPHP\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use GGPHP\ShiftSchedule\Services\ShiftDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ShiftRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ShiftRepositoryEloquent extends BaseRepository implements ShiftRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'shift_code' => 'like',
        'store_id',
        'status',
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
        $attributes['status'] = Shift::ON;
        $shift = $this->model()::create($attributes);
        ShiftDetailServices::add($shift->id, $attributes['time']);

        return parent::find($shift->id);
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
        $shift = $shift->update(['status' => $attributes['status']]);

        return parent::find($id);
    }

    /**
     * Override method update to delete owners
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function delete($id)
    {
        Schedule::where('shift_id', $id)->delete();
        ShiftDetail::where('shift_id', $id)->delete();

        return parent::delete($id);
    }
}
