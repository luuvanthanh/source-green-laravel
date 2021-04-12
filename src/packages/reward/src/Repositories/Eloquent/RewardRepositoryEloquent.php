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

    protected $userRepositoryEloquent;

    public function __construct(
        UserRepositoryEloquent $userRepositoryEloquent,
        Application $app
    ) {
        parent::__construct($app);
        $this->userRepositoryEloquent = $userRepositoryEloquent;
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
        $this->userRepositoryEloquent->model = $this->userRepositoryEloquent->model->query();

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->userRepositoryEloquent->model->whereHas('reward', function ($query) use ($attributes) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            })->with(['reward' => function ($query) use ($attributes) {
                $query->whereDate('date', '>=', $attributes['start_date'])->whereDate('date', '<=', $attributes['end_date']);
            }]);
        }

        if (!empty($attributes['limit'])) {
            $rewards = $this->userRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $rewards = $this->userRepositoryEloquent->get();
        }

        return $rewards;
    }

    /**
     * @param $attributes
     * @return mixed
     */
    public function getRewardByUser($attributes)
    {

        $this->model = $this->model->where('user_id', $attributes['user_id']);

        $this->model = $this->model->whereHas('user', function ($query) use ($attributes) {
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
