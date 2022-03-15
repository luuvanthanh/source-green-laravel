<?php

namespace GGPHP\EvaluateTeacher\Category\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\EvaluateTeacher\Category\Contracts\RatingLevelRepository;
use GGPHP\EvaluateTeacher\Category\Models\RatingLevel;
use GGPHP\EvaluateTeacher\Category\Presenters\RatingLevelPresenter;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class PositionLevelRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class RatingLevelRepositoryEloquent extends CoreRepositoryEloquent implements RatingLevelRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return RatingLevel::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return RatingLevelPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $ratingLevel = $this->paginate($attributes['limit']);
        } else {
            $ratingLevel = $this->get();
        }

        return $ratingLevel;
    }

    public function sort(array $attributes)
    {
        $listId = explode(',', $attributes['id']);

        foreach ($listId as $key => $value) {
            $fisrtValue = RatingLevel::find($value);
            $fisrtValue->update(['Number' => $key + 1]);
        }

        $result = RatingLevel::orderBy('Number')->get();
        return parent::parserResult($result);
    }
}
