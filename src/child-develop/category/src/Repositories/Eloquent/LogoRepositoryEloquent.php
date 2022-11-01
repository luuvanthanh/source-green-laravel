<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use GGPHP\ChildDevelop\Category\Models\Logo;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ChildDevelop\Category\Presenters\LogoPresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\LogoRepository;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class LogoRepositoryEloquent extends BaseRepository implements LogoRepository
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
        return Logo::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return LogoPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function createAll(array $attributes)
    {
        if (!empty($attributes['id'])) {
            $logoDelete = $this->model->find($attributes['id']);

            if (!is_null($logoDelete)) {
                $logoDelete->delete();
            }
        }

        $logo =  $this->model::create($attributes);

        return parent::parserResult($logo);
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $logo = $this->paginate($attributes['limit']);
        } else {
            $logo = $this->get();
        }

        return $logo;
    }
}
