<?php

namespace GGPHP\YoungAttendance\Absent\Repositories\Eloquent;

use GGPHP\Clover\Repositories\Eloquent\ParentRepositoryEloquent;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Presenters\AbsentPresenter;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ProfileInformationRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AbsentRepositoryEloquent extends CoreRepositoryEloquent implements AbsentRepository
{
    protected $parentRepositoryEloquent;

    public function __construct(
        ParentRepositoryEloquent $parentRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->parentRepositoryEloquent = $parentRepositoryEloquent;
    }

    protected $fieldSearchable = [
        'AbsentTypeId',
        'AbsentReasonId',
        'Parent.FullName' => 'like',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Absent::class;
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
        return AbsentPresenter::class;
    }

    /**
     * FilterAbsent
     * @param $attributes
     * @return mixed
     */
    public function filterAbsent($attributes, $parse = true)
    {
        if (!empty($attributes['absentTypeId'])) {
            $this->model = $this->model->where('AbsentTypeId', $attributes['absentTypeId']);
        }

        if (!empty($attributes['parentId'])) {
            $parentId = explode(',', $attributes['parentId']);
            $this->model = $this->model->where('ParentId', $parentId);
        }

        if (!empty($attributes['studentId'])) {
            $studentId = explode(',', $attributes['studentId']);
            $this->model = $this->model->where('StudentId', $studentId);
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->where(function ($q2) use ($attributes) {
                $q2->where([['StartDate', '<=', $attributes['startDate']], ['EndDate', '>=', $attributes['endDate']]])
                    ->orWhere([['StartDate', '>=', $attributes['startDate']], ['StartDate', '<=', $attributes['endDate']]])
                    ->orWhere([['EndDate', '>=', $attributes['startDate']], ['EndDate', '<=', $attributes['endDate']]]);
            });
        }

        if (!empty($attributes['limit'])) {
            $absents = $this->paginate($attributes['limit']);
        } else {
            $absents = $this->get();
        }

        return $absents;
    }

    /**
     * Get Absent
     * @param $attributes
     * @return mixed
     */
    public function getAbsent($attributes)
    {
        $this->parentRepositoryEloquent->model = $this->parentRepositoryEloquent->model->query();

        $this->parentRepositoryEloquent->model = $this->parentRepositoryEloquent->model->with(['absent' => function ($query) use ($attributes) {
            if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
                $query->whereDate('StartDate', '>=', $attributes['startDate'])->whereDate('StartDate', '<=', $attributes['endDate']);
            }

            if (!empty($attributes['absentTypeId'])) {
                $query->where('AbsentTypeId', $attributes['absentTypeId']);
            }

        }]);

        if (!empty($attributes['parentId'])) {
            $this->parentRepositoryEloquent->model->whereIn('Id', explode(',', $attributes['parentId']));
        }

        if (!empty($attributes['limit'])) {
            $parents = $this->parentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $parents = $this->parentRepositoryEloquent->get();
        }

        return $parents;
    }
}
