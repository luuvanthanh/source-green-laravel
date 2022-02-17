<?php

namespace GGPHP\Crm\ChildDevelop\Repositories\Eloquent;

use GGPHP\Crm\ChildDevelop\Models\CategorySkill;
use GGPHP\Crm\ChildDevelop\Presenters\CategorySkillPresenter;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\CategorySkillRepository;
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
        'created_at', 'numerical_skill'
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
            $this->model = $this->model->whereLike('name', $attributes['key']);
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
        $code = CategorySkill::max('code');
        $numericalSkill = CategorySkill::max('numerical_skill');

        if (is_null($code)) {
            $attributes['code'] = CategorySkill::CODE . '1';
        } else {
            $stt = substr($code, 3) + 1;
            $attributes['code'] = CategorySkill::CODE . $stt;
        }
        $attributes['numerical_skill'] = $numericalSkill + 1;
        $categorySkill = CategorySkill::create($attributes);

        return parent::parserResult($categorySkill);
    }

    public function sort(array $attributes)
    {
        $listId = explode(',', $attributes['id']);

        foreach ($listId as $key => $value) {
            $fisrtValue = CategorySkill::find($value);

            $fisrtValue->update(['numerical_skill' => $key + 1]);
        }
        $result = CategorySkill::orderBy('numerical_skill')->get();

        return parent::parserResult($result);
    }
}
