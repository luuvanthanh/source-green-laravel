<?php

namespace GGPHP\Crm\Config\Repositories\Eloquent;

use GGPHP\Crm\Config\Models\ClassArrangement;
use GGPHP\Crm\Config\Presenters\ClassArrangementPresenter;
use GGPHP\Crm\Config\Repositories\Contracts\ClassArrangementRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ClassArrangementRepositoryEloquent extends BaseRepository implements ClassArrangementRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ClassArrangement::class;
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
        return ClassArrangementPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $classArrangement = $this->paginate($attributes['limit']);
        } else {
            $classArrangement = $this->get();
        }

        return $classArrangement;
    }

    public function createOrUpdate(array $attributes)
    {
        if (!empty($attributes['create_rows'])) {
            foreach ($attributes['create_rows'] as $value) {
                $classArrangement = ClassArrangement::create($value);
            }
        }

        if (!empty($attributes['update_rows'])) {
            foreach ($attributes['update_rows'] as $value) {
                $classArrangement = ClassArrangement::find($value['id']);
                $classArrangement->update($value);
            }
        }

        if (!empty($attributes['delete_rows'])) {
            ClassArrangement::whereIn('id', $attributes['delete_rows'])->delete();
        }

        return parent::all();
    }
}
