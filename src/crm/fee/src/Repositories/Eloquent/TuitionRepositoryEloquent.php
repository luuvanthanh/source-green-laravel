<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\Tuition;
use GGPHP\Crm\Fee\Presenters\TuitionPresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\TuitionRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TuitionRepositoryEloquent extends BaseRepository implements TuitionRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Tuition::class;
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
        return TuitionPresenter::class;
    }

    public function getTuition(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $tuition = $this->paginate($attributes['limit']);
        } else {
            $tuition = $this->get();
        }

        return $tuition;
    }
}
