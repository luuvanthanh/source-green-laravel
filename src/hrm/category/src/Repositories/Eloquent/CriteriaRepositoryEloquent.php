<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Criteria;
use GGPHP\Category\Models\CriteriaDetail;
use GGPHP\Category\Presenters\CriteriaPresenter;
use GGPHP\Category\Repositories\Contracts\CriteriaRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class BlockRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class CriteriaRepositoryEloquent extends CoreRepositoryEloquent implements CriteriaRepository
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
        return Criteria::class;
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
        return CriteriaPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['id'])) {
            $this->model = $this->model::where('Id', $attributes['id']);
        }

        if (!empty($attributes['level'])) {
            $this->model = $this->model->whereHas('criteriaDetail', function ($query) use ($attributes) {
                $level = CriteriaDetail::LEVEL[$attributes['level']];
                $query->where('Level', $level);
            });
        }

        if (!empty($attributes['limit'])) {
            $criteria = $this->paginate($attributes['limit']);
        } else {
            $criteria = $this->get();
        }

        return $criteria;
    }

    public function createAll($attributes)
    {
        \DB::beginTransaction();
        try {
            $criteria = $this->model()::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->detail($attributes['detail'], $criteria->Id);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($criteria->Id);
    }

    public function detail(array $attributes, $id)
    {
        if (!empty($attributes['createRow'])) {
            foreach ($attributes['createRow'] as $value) {
                $value['criteriaId'] = $id;
                $value['level'] = CriteriaDetail::LEVEL[$value['level']];
                $criteriaDetail = CriteriaDetail::create($value);
            }
        }

        if (!empty($attributes['updateRow'])) {
            foreach ($attributes['updateRow'] as $value) {
                $criteriaDetail = CriteriaDetail::find($value['id']);
                $criteriaDetail->update($value);
            }
        }

        if (!empty($attributes['deleteRow'])) {
            CriteriaDetail::whereIn('Id', $attributes['deleteRow'])->delete();
        }

        return true;
    }

    public function updateAll(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $criteria = $this->model()::find($id);
            $criteria->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->detail($attributes['detail'], $criteria->Id);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }
}
