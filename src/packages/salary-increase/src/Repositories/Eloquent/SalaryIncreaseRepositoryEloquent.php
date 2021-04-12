<?php

namespace GGPHP\SalaryIncrease\Repositories\Eloquent;

use GGPHP\SalaryIncrease\Models\SalaryIncrease;
use GGPHP\SalaryIncrease\Presenters\SalaryIncreasePresenter;
use GGPHP\SalaryIncrease\Repositories\Contracts\SalaryIncreaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SalaryIncreaseRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SalaryIncreaseRepositoryEloquent extends BaseRepository implements SalaryIncreaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'id',
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
                $tranfer->parameterValues()->attach($value['salary_increase_id'], ['value' => $value['value']]);
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }

    public function getSalaryIncrease(array $attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $salaryIncrease = $this->paginate($attributes['limit']);
        } else {
            $salaryIncrease = $this->get();
        }

        return $salaryIncrease;
    }
}
