<?php

namespace GGPHP\SalaryIncrease\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\SalaryIncrease\Presenters\SalaryIncreasePresenter;
use GGPHP\SalaryIncrease\Repositories\Contracts\SalaryIncreaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class SalaryIncreaseRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SalaryIncreaseRepositoryEloquent extends CoreRepositoryEloquent implements SalaryIncreaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SalaryIncrease::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return SalaryIncreasePresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $tranfer = SalaryIncrease::create($attributes);
            foreach ($attributes['detail'] as $value) {
                $tranfer->parameterValues()->attach($value['parameterValueId'], ['Value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getSalaryIncrease(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $salaryIncrease = $this->paginate($attributes['limit']);
        } else {
            $salaryIncrease = $this->get();
        }

        return $salaryIncrease;
    }
}
