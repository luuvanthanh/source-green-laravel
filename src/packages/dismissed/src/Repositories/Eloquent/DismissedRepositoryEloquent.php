<?php

namespace GGPHP\Dismissed\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\Dismissed\Presenters\DismissedPresenter;
use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use GGPHP\Dismissed\Services\DismissedDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DismissedRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DismissedRepositoryEloquent extends CoreRepositoryEloquent implements DismissedRepository
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
        return Dismissed::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DismissedPresenter::class;
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
            $tranfer = Dismissed::create($attributes);
            DismissedDetailServices::add($tranfer->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getDismissed(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['limit'])) {
            $dismissed = $this->paginate($attributes['limit']);
        } else {
            $dismissed = $this->get();
        }

        return $dismissed;
    }
}
