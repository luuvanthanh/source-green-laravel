<?php

namespace GGPHP\Crm\Category\Repositories\Eloquent;

use GGPHP\Crm\Category\Models\Tag;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\Crm\Category\Presenters\TagPresenter;
use GGPHP\Crm\Category\Repositories\Contracts\TagRepository;

/**
 * Class StatusParentPotentialRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class TagRepositoryEloquent extends BaseRepository implements TagRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Tag::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return TagPresenter::class;
    }
}
