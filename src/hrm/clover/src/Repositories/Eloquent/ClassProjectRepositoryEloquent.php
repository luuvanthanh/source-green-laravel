<?php

namespace GGPHP\Clover\Repositories\Eloquent;

use GGPHP\Clover\Models\ClassProject;
use GGPHP\Clover\Presenters\ClassProjectPresenter;
use GGPHP\Clover\Repositories\Contracts\ClassProjectRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class ClassRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ClassProjectRepositoryEloquent extends CoreRepositoryEloquent implements ClassProjectRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'FullName' => 'like',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ClassProject::class;
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
        return ClassProjectPresenter::class;
    }

    public function getProject(array $attributes)
    {
        if (!empty($attributes['parentId'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->whereIn('ParentId', explode(',', $attributes['parentId']))->where('Type', 'PROJECT');
            });
        }

        if (!empty($attributes['limit'])) {
            $projects = $this->paginate($attributes['limit']);
        } else {
            $projects = $this->get();
        }
        
        return $projects;
    }
}
