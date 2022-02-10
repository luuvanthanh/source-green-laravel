<?php

namespace GGPHP\Crm\Fee\Repositories\Eloquent;

use GGPHP\Crm\Fee\Models\Fee;
use GGPHP\Crm\Fee\Presenters\FeePresenter;
use GGPHP\Crm\Fee\Repositories\Contracts\FeeRepository;
use GGPHP\Crm\Fee\Services\FeeCloverService;
use GGPHP\Crm\Fee\Services\SchoolYearCloverService;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SsoAccountRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class FeeRepositoryEloquent extends BaseRepository implements FeeRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Fee::class;
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
        return FeePresenter::class;
    }

    public function getFee(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $fee = $this->paginate($attributes['limit']);
        } else {
            $fee = $this->get();
        }

        return $fee;
    }

    public function getFeeClover()
    {
        FeeCloverService::result();
    }
}
