<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use Faker\Guesser\Name;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ChildDevelop\Category\Models\NameAssessmentPeriod;
use GGPHP\ChildDevelop\Category\Presenters\NameAssessmentPeriodPresenter;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\NameAssessmentPeriodRepository;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class NameAssessmentPeriodRepositoryEloquent extends BaseRepository implements NameAssessmentPeriodRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return NameAssessmentPeriod::class;
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
        return NameAssessmentPeriodPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $nameAssessmentPeriod = $this->paginate($attributes['limit']);
        } else {
            $nameAssessmentPeriod = $this->get();
        }

        return $nameAssessmentPeriod;
    }

    public function create(array $attributes)
    {
        $nameAssessmentPeriod = NameAssessmentPeriod::create($attributes);

        return $this->parserResult($nameAssessmentPeriod);
    }

    public function update(array $attributes, $id)
    {
        $nameAssessmentPeriod = NameAssessmentPeriod::find($id);
        $nameAssessmentPeriod->update($attributes);

        return $this->parserResult($nameAssessmentPeriod);
    }
}
