<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\CategoryChildIssue;
use GGPHP\ChildDevelop\Category\Presenters\CategoryChildIssuePresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\CategoryChildIssueRepository;
use GGPHP\ChildDevelop\Category\Services\ChildDevelopCategoryCrmServices;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryChildIssueRepositoryEloquent extends BaseRepository implements CategoryChildIssueRepository
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
        return CategoryChildIssue::class;
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
        return CategoryChildIssuePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryChildIssue = $this->paginate($attributes['limit']);
        } else {
            $categoryChildIssue = $this->get();
        }

        return $categoryChildIssue;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = CategoryChildIssue::max('Code');

            if (is_null($code)) {
                $attributes['Code'] = CategoryChildIssue::CODE . '1';
            } else {
                $stt = substr($code, 2) + 1;
                $attributes['Code'] = CategoryChildIssue::CODE . $stt;
            }
            $categoryChildIssue = CategoryChildIssue::create($attributes);

            $data = [
                'name' => $categoryChildIssue->Name,
                'category_child_issue_clover_id' => $categoryChildIssue->Id
            ];

            $categoryChildIssueCrmId = ChildDevelopCategoryCrmServices::createCategoryChildIssue($data);

            if (isset($categoryChildIssueCrmId->data->id)) {
                $categoryChildIssue->CategoryChildIssueCrmId = $categoryChildIssueCrmId->data->id;
                $categoryChildIssue->update();
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($categoryChildIssue);
    }

    public function update(array $attributes, $id)
    {
        \DB::beginTransaction();
        try {
            $categoryChildIssue = CategoryChildIssue::find($id);
            $categoryChildIssue->update($attributes);

            if (!is_null($categoryChildIssue->CategoryChildIssueCrmId)) {
                $data = [
                    'id' => $categoryChildIssue->CategoryChildIssueCrmId,
                    'name' => $categoryChildIssue->Name,
                ];

                ChildDevelopCategoryCrmServices::updateCategoryChildIssue($data, $$categoryChildIssue->CategoryChildIssueCrmId);
            }
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($id);
    }

    public function delete($id)
    {
        \DB::beginTransaction();
        try {
            $categoryChildIssue = CategoryChildIssue::findOrFail($id);
            $categoryChildIssueId = $categoryChildIssue->CategoryChildIssueCrmId;

            if (!is_null($categoryChildIssueId)) {
                ChildDevelopCategoryCrmServices::deleteCategoryChildIssue($categoryChildIssueId);
            }

            $categoryChildIssue->delete();
            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }
        
        return parent::all();
    }
}
