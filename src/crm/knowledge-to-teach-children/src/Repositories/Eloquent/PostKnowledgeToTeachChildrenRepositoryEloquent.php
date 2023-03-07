<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Eloquent;

use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\PostKnowledgeToTeachChildrenRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\KnowledgeToTeachChildren\Presenters\PostknowledgeToTeachChildrenPresenter;
use Http\Client\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class PostKnowledgeToTeachChildrenRepositoryEloquent extends BaseRepository implements PostKnowledgeToTeachChildrenRepository
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
        return PostKnowledgeToTeachChildren::class;
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
        return PostknowledgeToTeachChildrenPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])->orWhereLike('content', $attributes['key']);
        }

        if (!empty($attributes['category_knowledge_to_teach_children_id'])) {
            $this->model = $this->model->where('category_knowledge_to_teach_children_id',$attributes['category_knowledge_to_teach_children_id']);
        }

        if (!empty($attributes['from_date']) && !empty($attributes['to_date'])) {
            $this->model = $this->model->whereDate('created_at','>=',$attributes['from_date'])->whereDate('created_at','<=',$attributes['to_date']);
        }

        if (!empty($attributes['limit'])) {
            $knowledgeToTeachChildren = $this->paginate($attributes['limit']);
        } else {
            $knowledgeToTeachChildren = $this->get();
        }
        return $knowledgeToTeachChildren;
    }

    public function create(array $attributes)
    {
        $result = PostKnowledgeToTeachChildren::create($attributes);

        return parent::parserResult($result);
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = PostKnowledgeToTeachChildren::findOrfail($id);
        $admissionRegister->update($attributes);

        return parent::find($id);
    }

    public function getBmiChildren(array $attributes)
    {
        $admissionRegister = [];
        $result = number_format(($attributes['weight'] / $attributes['height'] * $attributes['height']) * ($attributes['height'] / 100));
        $admissionRegister['result_bmi'] = $result;

        return $admissionRegister;
    }
}