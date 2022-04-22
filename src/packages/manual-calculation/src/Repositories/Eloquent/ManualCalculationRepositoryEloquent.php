<?php

namespace GGPHP\ManualCalculation\Repositories\Eloquent;

use App\Models\User;
use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\ManualCalculation\Models\ManualCalculation;
use GGPHP\ManualCalculation\Presenters\ManualCalculationPresenter;
use GGPHP\ManualCalculation\Repositories\Contracts\ManualCalculationRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container;
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
                $query->where('EmployeeId', $employeeId);
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
        $attributes['type'] = ManualCalculation::TYPE[$attributes['type']];
        $manualCalculation = $this->model->where('EmployeeId', $attributes['employeeId'])->where('Date', $date)->first();

        if (is_null($manualCalculation)) {
            $manualCalculation = $this->model->create($attributes);
        } else {
            $manualCalculation->update($attributes);
        }

        return $this->parserResult($manualCalculation);
    }
}
