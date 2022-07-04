<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\AbsentType;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentTypePresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentTypeRepository;
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

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }
        
        if (!empty($attributes['limit'])) {
            $TypeStudent = $this->paginate($attributes['limit']);
        } else {
            $TypeStudent = $this->get();
        }

        return $TypeStudent;
    }
}
