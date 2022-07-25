<?php

namespace GGPHP\Category\Repositories\Eloquent;

use GGPHP\Category\Models\Block;
use GGPHP\Category\Models\Grade;
use GGPHP\Category\Models\GradeDetail;
use GGPHP\Category\Presenters\BlockPresenter;
use GGPHP\Category\Presenters\GradePresenter;
use GGPHP\Category\Repositories\Contracts\GradeRepository;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class GradeRepositoryEloquent.
 *
 * @package namespace GGPHP\Category\Repositories\Eloquent;
 */
class GradeRepositoryEloquent extends CoreRepositoryEloquent implements GradeRepository
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
        return Grade::class;
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
        return GradePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Name', $attributes['key']);
                $query->orWhereLike('Code', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $grade = $this->paginate($attributes['limit']);
        } else {
            $grade = $this->get();
        }

        return $grade;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $grade = $this->model()::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $grade);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($grade->Id);
    }

    public function forDetail($attributes, $model)
    {
        if (!empty($attributes['createRow'])) {
            foreach ($attributes['createRow'] as $value) {
                $value['level'] = GradeDetail::LEVEL[$value['level']];
                $value['gradeId'] = $model->Id;
                GradeDetail::create($value);
            }
        }

        if (!empty($attributes['updateRow'])) {
            foreach ($attributes['updateRow'] as $value) {
                $value['level'] = GradeDetail::LEVEL[$value['level']];
                $gradeDetail = GradeDetail::find($value['id']);
                $gradeDetail->update($value);
            }
        }

        if (!empty($attributes['deleteRow'])) {
            GradeDetail::whereIn('Id', $attributes['deleteRow'])->delete();
        }

        return true;
    }

    public function updateAll(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $grade = $this->model()::find($id);
            $grade->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->forDetail($attributes['detail'], $grade);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }
}
