<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\SchoolYear;
use GGPHP\Crm\Fee\Presenters\SchoolYearPresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\SchoolYearRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SchoolYearRepositoryEloquent extends BaseRepository implements SchoolYearRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return SchoolYear::class;
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
        return SchoolYearPresenter::class;
    }

    public function getSchoolYear(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $schoolYear = $this->paginate($attributes['limit']);
        } else {
            $schoolYear = $this->get();
        }

        return $schoolYear;
    }
}
