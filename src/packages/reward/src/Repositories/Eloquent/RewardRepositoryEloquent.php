<?php

namespace GGPHP\Reward\Repositories\Eloquent;

use GGPHP\Reward\Models\Reward;
use GGPHP\Reward\Presenters\RewardPresenter;
use GGPHP\Reward\Repositories\Contracts\RewardRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class UserRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class RewardRepositoryEloquent extends BaseRepository implements RewardRepository
{
    protected $fieldSearchable = [
        'id',
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

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->employeeRepositoryEloquent->model->whereHas('reward', function ($query) use ($attributes) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            })->with(['reward' => function ($query) use ($attributes) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            }]);
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

        $this->model = $this->model->where('EmployeeId', $attributes['EmployeeId']);

        $this->model = $this->model->whereHas('employee', function ($query) use ($attributes) {
            $query->tranferHistory($attributes);
        });

        $rewards = !empty($attribute['limit']) ? $this->paginate($attribute['limit']) : $this->get();

        return $rewards;
    }

    /**
     * Cancel Fault.
     *
     * @param object $entity
     * @param array $images
     * @param string $collection
     */
    public function addMediaToEntity($entity, $images = [], $collection = 'files')
    {
        foreach ($images as $image_path) {
            $entity->addMediaFromDisk($image_path['path'])->usingName($image_path['file_name'])->preservingOriginal()->toMediaCollection($collection);
        }
    }
}
