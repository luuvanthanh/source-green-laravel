<?php

namespace GGPHP\Profile\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Profile\Models\NumberFormContract;
use GGPHP\Profile\Presenters\NumberFormContractPresenter;
use GGPHP\Profile\Repositories\Contracts\NumberFormContractRepository;

/**
 * Class NumberFormContractRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class NumberFormContractRepositoryEloquent extends CoreRepositoryEloquent implements NumberFormContractRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return NumberFormContract::class;
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
        return NumberFormContractPresenter::class;
    }

    public function getAll(array $attributes)
    {
        $this->model = $this->model->when(!empty($attributes['type']), function ($query) use ($attributes) {
            return $query->where('Type', $attributes['type']);
        });

        $this->model = $this->model->when(!empty($attributes['contractDate']), function ($query) use ($attributes) {
            return $query->whereDate('StartDate','<=', $attributes['contractDate'])->whereDate('EndDate','>=',$attributes['contractDate']);
        });
        
        if (!empty($attributes['limit'])) {
            $result = $this->paginate($attributes['limit']);
        } else {
            $result = $this->get();
        }

        return $result;
    }
}
