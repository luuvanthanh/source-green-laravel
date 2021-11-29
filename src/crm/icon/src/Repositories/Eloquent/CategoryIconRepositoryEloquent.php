<?php

namespace GGPHP\Crm\Icon\Repositories\Eloquent;

use GGPHP\Crm\Icon\Models\CategoryIcon;
use GGPHP\Crm\Icon\Models\Icon;
use GGPHP\Crm\Icon\Presenters\CategoryIconPresenter;
use GGPHP\Crm\Icon\Presenters\IconPresenter;
use GGPHP\Crm\Icon\Repositories\Contracts\CategoryIconRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class CategoryIconRepositoryEloquent extends BaseRepository implements CategoryIconRepository
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
        return CategoryIcon::class;
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
        return CategoryIconPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $icon = $this->paginate($attributes['limit']);
        } else {
            $icon = $this->get();
        }

        return $icon;
    }
}
