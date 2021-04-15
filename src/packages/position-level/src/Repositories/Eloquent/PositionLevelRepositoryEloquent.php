<?php

namespace GGPHP\PositionLevel\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\PositionLevel\Presenters\PositionLevelPresenter;
use GGPHP\PositionLevel\Repositories\Contracts\PositionLevelRepository;
use GGPHP\Users\Models\User;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class PositionLevelRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PositionLevelRepositoryEloquent extends BaseRepository implements PositionLevelRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
        'EmployeeId',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return PositionLevel::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return PositionLevelPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * updateOrCreate education of employee
     * @param array $attributes
     * @return mixed|void
     */
    public function create(array $attributes)
    {
        $startDate = Carbon::parse($attributes['start_date']);
        $attributes['after_start_date'] = $startDate->subDay();

        $afterTranfer = PositionLevel::where('end_date', null)->where('EmployeeId', $attributes['EmployeeId'])->update(['end_date' => $attributes['after_start_date']]);

        $tranfer = PositionLevel::create($attributes);

        $employee = User::find($attributes['EmployeeId']);

        return parent::find($tranfer->id);
    }

    public function delete($id)
    {
        $tranfer = PositionLevel::find($id);
        $afterStartDate = $tranfer->start_date->subDay();

        $afterTranfer = PositionLevel::where('end_date', $afterStartDate)->where('EmployeeId', $tranfer->EmployeeId)->update(['end_date' => null]);

        return $tranfer->delete();
    }

    public function update(array $attributes, $id)
    {
        $tranfer = PositionLevel::find($id);
        $startDate = Carbon::parse($attributes['start_date']);
        $attributes['after_start_date'] = $startDate->subDay();

        $afterTranfer = PositionLevel::where('end_date', $tranfer->start_date->subDay())->where('EmployeeId', $tranfer->EmployeeId)->update(['end_date' => $attributes['after_start_date']]);

        $tranfer->update($attributes);

        return parent::find($tranfer->id);
    }

    public function getForUser(array $attributes, $id)
    {
        $result = $this->model->where('EmployeeId', $id)->where('end_date', null)->first();

        return parent::parserResult($result);
    }
}
