<?php

namespace GGPHP\Appoint\Repositories\Eloquent;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\Appoint\Presenters\AppointPresenter;
use GGPHP\Appoint\Repositories\Contracts\AppointRepository;
use GGPHP\Appoint\Services\AppointDetailServices;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AppointRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AppointRepositoryEloquent extends BaseRepository implements AppointRepository
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
        return Appoint::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return AppointPresenter::class;
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
            $tranfer = Appoint::create($attributes);
            AppointDetailServices::add($tranfer->id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->id);
    }

    public function getAppoint(array $attributes)
    {
        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['limit'])) {
            $appoint = $this->paginate($attributes['limit']);
        } else {
            $appoint = $this->get();
        }

        return $appoint;
    }
}
