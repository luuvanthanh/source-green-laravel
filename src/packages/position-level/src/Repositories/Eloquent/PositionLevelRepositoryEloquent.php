<?php

namespace GGPHP\PositionLevel\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\PositionLevel\Models\PositionLevel;
use GGPHP\PositionLevel\Presenters\PositionLevelPresenter;
use GGPHP\PositionLevel\Repositories\Contracts\PositionLevelRepository;
use GGPHP\Users\Models\User;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PositionLevelRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PositionLevelRepositoryEloquent extends CoreRepositoryEloquent implements PositionLevelRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
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
        $startDate = Carbon::parse($attributes['startDate']);
        $attributes['afterStartDate'] = $startDate->subDay();

        $afterTranfer = PositionLevel::where('EndDate', null)->where('EmployeeId', $attributes['employeeId'])->update(['EndDate' => $attributes['afterStartDate']]);

        $tranfer = PositionLevel::create($attributes);

        $employee = User::find($attributes['employeeId']);

        return parent::find($tranfer->Id);
    }

    public function delete($id)
    {
        $tranfer = PositionLevel::find($id);
        $afterStartDate = $tranfer->StartDate->subDay();

        $afterTranfer = PositionLevel::where('EndDate', $afterStartDate)->where('EmployeeId', $tranfer->EmployeeId)->update(['EndDate' => null]);

        return $tranfer->delete();
    }

    public function update(array $attributes, $id)
    {
        $tranfer = PositionLevel::find($id);
        $startDate = Carbon::parse($attributes['startDate']);
        $attributes['afterStartDate'] = $startDate->subDay();

        $afterTranfer = PositionLevel::where('EndDate', $tranfer->StartDate->subDay())->where('EmployeeId', $tranfer->EmployeeId)->update(['EndDate' => $attributes['afterStartDate']]);

        $tranfer->update($attributes);

        return parent::find($tranfer->Id);
    }

    public function getForUser(array $attributes, $id)
    {
        $result = $this->model->where('EmployeeId', $id)->where('EndDate', null)->first();

        return parent::parserResult($result);
    }

    public function getPositionLevel(array $attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $positionLevel = $this->paginate($attributes['limit']);
        } else {
            $positionLevel = $this->get();
        }

        return $positionLevel;
    }
}
