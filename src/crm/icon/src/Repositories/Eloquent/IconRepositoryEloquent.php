<?php

namespace GGPHP\Crm\Icon\Repositories\Eloquent;

use GGPHP\Crm\Icon\Models\Icon;
use GGPHP\Crm\Icon\Presenters\IconPresenter;
use GGPHP\Crm\Icon\Repositories\Contracts\IconRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class IconRepositoryEloquent extends BaseRepository implements IconRepository
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
        return Icon::class;
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
        return IconPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where('category_icon_id', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $icon = $this->paginate($attributes['limit']);
        } else {
            $icon = $this->get();
        }

        return $icon;
    }

    // public function create(array $attributes)
    // {
    //     $icons = explode(',', $attributes['icon']);
    //     foreach ($icons as $icon) {
    //         $data=[
    //             'icon' =>$icon,
    //             'category_icon_id'=>$attributes['category_icon_id']
    //         ];
            
    //         $icon = Icon::create($data);
    //     }

    //     return parent::parserResult($icon);
    // }
}
