<?php

namespace GGPHP\Absent\Repositories\Eloquent;

use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Presenters\AbsentTypePresenter;
use GGPHP\Absent\Repositories\Absent\AbsentTypeRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentTypeRepositoryEloquent extends CoreRepositoryEloquent implements AbsentTypeRepository
{
    protected $fieldSearchable = [
        'Status',
        'Name' => 'like',
        'CreationTime',
        'Id',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return AbsentType::class;
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
        return AbsentTypePresenter::class;
    }

    public function getAbsentType(array $attributes)
    {
        if (!empty($attributes['type'])) {
            $type = explode(',', $attributes['type']);
            $this->model = $this->model->whereIn('Type', $type);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $absentType = $this->paginate($attributes['limit']);
        } else {
            $absentType = $this->get();
        }

        return $absentType;
    }
}
