<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\CategoryRelationship;
use GGPHP\Crm\Category\Presenters\CategoryRelationshipPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryRelationshipRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryRelationshipRepositoryEloquent extends BaseRepository implements CategoryRelationshipRepository
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
        return CategoryRelationship::class;
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
        return CategoryRelationshipPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])->orWhereLike('code', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryRelationship = $this->paginate($attributes['limit']);
        } else {
            $categoryRelationship = $this->get();
        }

        return $categoryRelationship;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = CategoryRelationship::max('code');

            if (is_null($code)) {
                $attributes['code'] = CategoryRelationship::CODE . 1;
            } else {
                $stt = substr($code, 3) + 1;
                $attributes['code'] = CategoryRelationship::CODE . $stt;
            }

            $categoryRelationship = CategoryRelationship::create($attributes);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::parserResult($categoryRelationship);
    }
}
