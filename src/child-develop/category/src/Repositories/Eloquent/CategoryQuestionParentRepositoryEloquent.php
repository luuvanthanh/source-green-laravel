<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\CategoryQuestionParent;
use GGPHP\ChildDevelop\Category\Presenters\CategoryQuestionParentPresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryQuestionParentRepository;
use GGPHP\ChildDevelop\Category\Services\ChildDevelopCategoryCrmServices;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryQuestionParentRepositoryEloquent extends BaseRepository implements CategoryQuestionParentRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return CategoryQuestionParent::class;
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
        return CategoryQuestionParentPresenter::class;
    }

    public function getAll($attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryQuestionParent = $this->paginate($attributes['limit']);
        } else {
            $categoryQuestionParent = $this->get();
        }

        return $categoryQuestionParent;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            if (!empty($attributes['createRows'])) {
                foreach ($attributes['createRows'] as $value) {
                    $categoryQuestionParent = CategoryQuestionParent::create($value);
                    $create[] = $categoryQuestionParent->Id;
                    $value['category_question_parent_clover_id'] = $categoryQuestionParent->Id;
                    $dataCreate[] = $value;
                }

                $categoryCrm = ChildDevelopCategoryCrmServices::createRows($dataCreate);
                $collection = collect($categoryCrm->data);
               
                foreach ($create as $valueCreate) {
                    $lastCollect = $collection->first(function ($item) use ($valueCreate) {
                        return $item->attributes->category_question_parent_clover_id == $valueCreate;
                    });

                    $categoryQuestionParentUpdate = CategoryQuestionParent::find($valueCreate);
                    $categoryQuestionParentUpdate->update(['CategoryQuestionParentCrmId' => $lastCollect->id]);
                }
            }
            
            if (!empty($attributes['updateRows'])) {
                foreach ($attributes['updateRows'] as $value) {
                    $question = CategoryQuestionParent::find($value['id']);
                    $question->update($value);

                    $dataUpdate[] = [
                        'id' => $question->CategoryQuestionParentCrmId,
                        'question' => $value['question'],
                    ];
                }
                
                ChildDevelopCategoryCrmServices::updateRows($dataUpdate);
            }

            if (!empty($attributes['deleteRows'])) {
                $collection = CategoryQuestionParent::whereIn('Id', $attributes['deleteRows'])->get();

                $crmId['delete_rows'] = $collection->pluck('CategoryQuestionParentCrmId')->toArray();
                ChildDevelopCategoryCrmServices::deleteRows($crmId);

                CategoryQuestionParent::whereIn('Id', $attributes['deleteRows'])->delete();
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }
}
