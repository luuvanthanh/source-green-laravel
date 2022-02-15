<?php

namespace GGPHP\Fee\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Fee\Models\Fee;
use GGPHP\Fee\Presenters\FeePresenter;
use GGPHP\Fee\Repositories\Contracts\FeeRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class FeeRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FeeRepositoryEloquent extends CoreRepositoryEloquent implements FeeRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Fee::class;
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
        return FeePresenter::class;
    }

    public function filterFee(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->where('Type', $attributes['type']);
        }

        if (!empty($attributes['feeCrmId'])) {
            $this->model = $this->model->where('FeeCrmId', null);
        }

        if (!empty($attributes['limit'])) {
            $fee = $this->paginate($attributes['limit']);
        } else {
            $fee = $this->get();
        }

        return $fee;
    }

    public function updateFeeCrm(array $attributes)
    {
        foreach ($attributes as $item) {
            $schoolYear = Fee::findOrfail($item['fee_clover_id']);

            $schoolYear->update(['FeeCrmId' => $item['id']]);
        }
    }
}
