<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Eloquent;

use GGPHP\Crm\KnowledgeToTeachChildren\Models\CategoryKnowledgeToTeachChildren;
use GGPHP\Crm\KnowledgeToTeachChildren\Models\PostKnowledgeToTeachChildren;
use GGPHP\Crm\KnowledgeToTeachChildren\Repositories\Contracts\CategoryKnowledgeToTeachChildrenRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\KnowledgeToTeachChildren\Presenters\CategoryknowledgeToTeachChildrenPresenter;
use Http\Client\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryKnowledgeToTeachChildrenRepositoryEloquent extends BaseRepository implements CategoryKnowledgeToTeachChildrenRepository
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
        return CategoryKnowledgeToTeachChildren::class;
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
        return CategoryknowledgeToTeachChildrenPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['status'])) {
            $this->model = $this->model->with(['postKnowledgeToTeachChildren' => function($query) use ($attributes){
                $query->where('status', $attributes['status']);
            }]);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])->orWhereLike('code', $attributes['key'])->orWhereLike('description', $attributes['key']);
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
        $attributes = $this->creating($attributes);

        $result = CategoryKnowledgeToTeachChildren::create($attributes);


        return parent::parserResult($result);
    }

    public function creating($attributes) {
        $code = CategoryKnowledgeToTeachChildren::latest()->first();

        if (is_null($code)) {
            $code = CategoryKnowledgeToTeachChildren::CODE . '0001';
        }else {
            $stt = substr($code->code, 4);
            $stt += 1;

            if(strlen($stt) == 1){
                $code = CategoryKnowledgeToTeachChildren::CODE . '000' . $stt;
            }elseif (strlen($stt) == 2) {
                $code = CategoryKnowledgeToTeachChildren::CODE . '00' . $stt;
            }elseif (strlen($stt) == 3) {
                $code = CategoryKnowledgeToTeachChildren::CODE . '0' . $stt;
            }else {
                $code = CategoryKnowledgeToTeachChildren::CODE . $stt;
            }
        }
        $attributes['code'] = $code;
        
        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        $admissionRegister = CategoryKnowledgeToTeachChildren::findOrfail($id);

        $admissionRegister->update($attributes);

        return parent::find($id);
    }
}
