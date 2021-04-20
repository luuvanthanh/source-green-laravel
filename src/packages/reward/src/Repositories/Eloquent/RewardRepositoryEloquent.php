<?php

namespace GGPHP\Reward\Repositories\Eloquent;

use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Reward\Models\Reward;
use GGPHP\Reward\Presenters\RewardPresenter;
use GGPHP\Reward\Repositories\Contracts\RewardRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class RewardRepositoryEloquent extends CoreRepositoryEloquent implements RewardRepository
{
    protected $fieldSearchable = [
        'Id',
    ];

    protected $employeeRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $employeeRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->employeeRepositoryEloquent = $employeeRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Reward::class;
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
        return RewardPresenter::class;
    }

    /**
     * @param $attributes
     * @return mixed
     */
    public function getRewardUserList($attributes)
    {
        $this->employeeRepositoryEloquent->model = $this->employeeRepositoryEloquent->model->query();

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->employeeRepositoryEloquent->model->whereHas('reward', function ($query) use ($attributes) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            })->with(['reward' => function ($query) use ($attributes) {
                $query->whereDate('Date', '>=', $attributes['startDate'])->whereDate('Date', '<=', $attributes['endDate']);
            }]);
        }

        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->employeeRepositoryEloquent->model = $this->model->employeeRepositoryEloquent->whereIn('Id', $employeeId);
        }

        if (!empty($attributes['limit'])) {
            $rewards = $this->employeeRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $rewards = $this->employeeRepositoryEloquent->get();
        }

        return $rewards;
    }

    /**
     * @param $attributes
     * @return mixed
     */
    public function getRewardByUser($attributes)
    {
        if (!empty($attributes['employeeId'])) {
            $employeeId = explode(',', $attributes['employeeId']);
            $this->model = $this->model->whereIn('EmployeeId', $employeeId);
        }

        $rewards = !empty($attribute['limit']) ? $this->paginate($attribute['limit']) : $this->get();

        return $rewards;
    }
}
