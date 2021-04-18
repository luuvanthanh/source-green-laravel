<?php

namespace GGPHP\Appoint\Repositories\Eloquent;

use GGPHP\Appoint\Models\Appoint;
use GGPHP\Appoint\Presenters\AppointPresenter;
use GGPHP\Appoint\Repositories\Contracts\AppointRepository;
use GGPHP\Appoint\Services\AppointDetailServices;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class AppointRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AppointRepositoryEloquent extends CoreRepositoryEloquent implements AppointRepository
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
            AppointDetailServices::add($tranfer->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
        }

        return parent::find($tranfer->Id);
    }

    public function getAppoint(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['limit'])) {
            $appoint = $this->paginate($attributes['limit']);
        } else {
            $appoint = $this->get();
        }

        return $appoint;
    }
}
