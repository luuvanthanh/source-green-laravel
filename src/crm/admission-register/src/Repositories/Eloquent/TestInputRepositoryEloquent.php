<?php

namespace GGPHP\Crm\AdmissionRegister\Repositories\Eloquent;

use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\AdmissionRegister\Presenters\TestInputPresenter;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\TestInputRepository;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class CustomerLeadRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TestInputRepositoryEloquent extends BaseRepository implements TestInputRepository
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
        return TestInput::class;
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
        return TestInputPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['limit'])) {
            $testInput = $this->paginate($attributes['limit']);
        } else {
            $testInput = $this->get();
        }

        return $testInput;
    }
}
