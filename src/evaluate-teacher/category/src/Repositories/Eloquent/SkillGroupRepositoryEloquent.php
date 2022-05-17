<?php

namespace GGPHP\EvaluateTeacher\Category\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\EvaluateTeacher\Category\Contracts\SkillGroupRepository;
use GGPHP\EvaluateTeacher\Category\Models\SkillGroup;
use GGPHP\EvaluateTeacher\Category\Models\SkillGroupDetail;
use GGPHP\EvaluateTeacher\Category\Presenters\SkillGroupPresenter;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class PositionLevelRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SkillGroupRepositoryEloquent extends CoreRepositoryEloquent implements SkillGroupRepository
{

    /**
     * @var array
     */
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
        return SkillGroup::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return SkillGroupPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $skillGroup = $this->paginate($attributes['limit']);
        } else {
            $skillGroup = $this->get();
        }

        return $skillGroup;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $skillGroup = SkillGroup::latest()->first();

            if (is_null($skillGroup)) {
                $attributes['code'] = SkillGroup::CODE . '1';
            } else {
                $columnCode = $skillGroup->Code;
                $getNumber = substr($columnCode, 3) + 1;
                $attributes['code'] = SkillGroup::CODE . $getNumber;
            }

            $skillGroup = SkillGroup::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->skillGroupDetail($attributes['detail'], $skillGroup);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($skillGroup->Id);
    }

    public function skillGroupDetail(array $attributes, $skillGroup)
    {
        if (!empty($attributes['createRow'])) {
            $number = 1;
            foreach ($attributes['createRow'] as $value) {
                $value['SkillGroupId'] = $skillGroup->Id;
                $value['code'] = $skillGroup->Code . '.' . $number++;
                SkillGroupDetail::create($value);
            }
        }

        if (!empty($attributes['updateRow'])) {
            foreach ($attributes['updateRow'] as $value) {
                $detail = SkillGroupDetail::find($value['id']);
                $detail->update($value);
            }
        }

        if (!empty($attributes['deleteRow'])) {
            SkillGroupDetail::whereIn('Id', $attributes['deleteRow'])->delete();
        }

        return true;
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $skillGroup = SkillGroup::find($id);
            $skillGroup->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->skillGroupDetail($attributes['detail'], $skillGroup);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($skillGroup->Id);
    }
}
