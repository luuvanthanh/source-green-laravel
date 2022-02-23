<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\CategoryEvent;
use GGPHP\Crm\Category\Presenters\CategoryEventPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\CategoryEventRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryEventRepositoryEloquent extends BaseRepository implements CategoryEventRepository
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
        return CategoryEvent::class;
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
        return CategoryEventPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('name', $attributes['key'])->orWhereLike('code', $attributes['key'])->orWhereLike('description', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $categoryEvent = $this->paginate($attributes['limit']);
        } else {
            $categoryEvent = $this->get();
        }

        return $categoryEvent;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $code = CategoryEvent::max('code');

            if (is_null($code)) {
                $attributes['code'] = CategoryEvent::CODE . 1;
            } else {
                $stt = substr($code, 2) + 1;
                $attributes['code'] = CategoryEvent::CODE . $stt;
            }
           
            $categoryEvent = CategoryEvent::create($attributes);

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollback();
            throw new HttpException(500, $e->getMessage());
        }

        return parent::parserResult($categoryEvent);
    }
}
