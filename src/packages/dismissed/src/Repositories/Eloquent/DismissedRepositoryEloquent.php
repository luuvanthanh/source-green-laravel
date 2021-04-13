<?php

namespace GGPHP\Dismissed\Repositories\Eloquent;

use GGPHP\Dismissed\Models\Dismissed;
use GGPHP\Dismissed\Presenters\DismissedPresenter;
use GGPHP\Dismissed\Repositories\Contracts\DismissedRepository;
use GGPHP\Dismissed\Services\DismissedDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class DismissedRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DismissedRepositoryEloquent extends BaseRepository implements DismissedRepository
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
            DismissedDetailServices::add($tranfer->id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            dd($e);
            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }

    public function getDismissed(array $attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $dismissed = $this->paginate($attributes['limit']);
        } else {
            $dismissed = $this->get();
        }

        return $dismissed;
    }
}
