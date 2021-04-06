<?php

namespace GGPHP\AddSubTime\Repositories\Eloquent;

use GGPHP\AddSubTime\Models\AddSubTime;
use GGPHP\AddSubTime\Presenters\AddSubTimePresenter;
use GGPHP\AddSubTime\Repositories\Contracts\AddSubTimeRepository;
use GGPHP\Users\Repositories\Eloquent\UserRepositoryEloquent;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class AddSubTimeRepositoryEloquent.
 *
 * @package namespace GGPHP\AddSubTime\Repositories\Eloquent;
 */
class AddSubTimeRepositoryEloquent extends BaseRepository implements AddSubTimeRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'user_id',
        'user.full_name' => 'like',
        'type',
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
        return AddSubTime::class;
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
        return AddSubTimePresenter::class;
    }

    /**
     * @param $attributes
     */
    public function createAddSubTime($attributes)
    {
        $addSubTime = $this->model()::create($attributes);
        $addSubTime->addSubTimeDetail()->createMany($attributes['data']);

        return $this->parserResult($addSubTime);
    }

    public function filterAdditionalByMonth($attributes)
    {
        $this->model = $this->model->query();

        if (!empty($attributes['start_date']) && !empty($attributes['end_date'])) {
            $this->model = $this->model->whereDate('created_at', '>=', $attributes['start_date'])->whereDate('created_at', '<=', $attributes['end_date']);
        }

        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
            $this->model = $this->model->whereHas('addSubTimeDetail', function ($queryDetail) use ($attributes) {
                $queryDetail->whereDate('start_date', '>=', $attributes['start_time'])->whereDate('end_date', '<=', $attributes['end_time']);
            });
        }

        if (!empty($attributes['limit'])) {
            $additionals = $this->paginate($attributes['limit']);
        } else {
            $additionals = $this->get();
        }

        return $additionals;
    }

    public function generalAddSubTime($attributes)
    {
        $users = $this->userRepositoryEloquent->model->query();

        $users->whereHas('addSubTime', function ($query) use ($attributes) {
            if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
                $query->whereHas('addSubTimeDetail', function ($q) use ($attributes) {
                    $q->whereDate('start_date', '>=', $attributes['start_time'])->whereDate('end_date', '<=', $attributes['end_time']);
                });
            }
        });

        $users->with(['addSubTime' => function ($query) use ($attributes) {
            if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
                $query->whereHas('addSubTimeDetail', function ($q) use ($attributes) {
                    $q->whereDate('start_date', '>=', $attributes['start_time'])->whereDate('end_date', '<=', $attributes['end_time']);
                });
            }
        }]);

        if (!empty($attributes['limit'])) {
            $users = $users->paginate($attributes['limit']);
        } else {
            $users = $users->get();
        }

        return $this->userRepositoryEloquent->parserResult($users);
    }

}
