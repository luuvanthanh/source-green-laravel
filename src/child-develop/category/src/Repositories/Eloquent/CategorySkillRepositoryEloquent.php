<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\CategorySkill;
use GGPHP\ChildDevelop\Category\Presenters\CategorySkillPresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategorySkillRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategorySkillRepositoryEloquent extends BaseRepository implements CategorySkillRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime', 'NumericalSkill'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CategorySkill::class;
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
        return CategorySkillPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categorySkill = $this->paginate($attributes['limit']);
        } else {
            $categorySkill = $this->get();
        }

        return $categorySkill;
    }

    public function create(array $attributes)
    {
        $code = CategorySkill::max('Code');
        $numericalSkill = CategorySkill::max('NumericalSkill');

        if (is_null($code)) {
            $attributes['Code'] = CategorySkill::CODE . "1";
        } else {
            $stt = substr($code, 3) + 1;
            $attributes['Code'] = CategorySkill::CODE . "$stt";
        }
        $attributes['NumericalSkill'] = $numericalSkill + 1;
        $categorySkill = CategorySkill::create($attributes);

        return parent::parserResult($categorySkill);
    }

    public function sort(array $attributes)
    {
        $listId = explode(',', $attributes['id']);

        foreach ($listId as $key => $value) {
            $fisrtValue = CategorySkill::find($value);

            $fisrtValue->update(['NumericalSkill' => $key + 1]);
        }
        $result = CategorySkill::orderBy('NumericalSkill')->get();

        return parent::parserResult($result);
    }

    public function update(array $attributes, $id)
    {
        $categorySkill = CategorySkill::find($id);
        $categorySkill->update($attributes);

        return parent::find($id);
    }
}
