<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\SearchSource;
use GGPHP\Crm\Category\Presenters\SearchSourcePresenter;
use GGPHP\Crm\Category\Repositories\Contracts\SearchSourceRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SearchSourceRepositoryEloquent extends BaseRepository implements SearchSourceRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SearchSource::class;
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
        return SearchSourcePresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('name', 'like', '%' . $attributes['key'] . '%');
        }

        if (!empty($attributes['limit'])) {
            $searchSource = $this->paginate($attributes['limit']);
        } else {
            $searchSource = $this->get();
        }

        return $searchSource;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $code = SearchSource::max('code');

            if (is_null($code)) {
                $attributes['code'] = SearchSource::CODE . "1";
            } else {
                $getNumber = substr($code, 1) + 1;
                $attributes['code'] = SearchSource::CODE . "$getNumber";
            }
            $searchSource = SearchSource::create($attributes);

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($searchSource);
    }
}
