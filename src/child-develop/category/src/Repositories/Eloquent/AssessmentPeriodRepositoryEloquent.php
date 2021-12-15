<?php

namespace GGPHP\ChildDevelop\Category\Repositories\Eloquent;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use GGPHP\ChildDevelop\Category\Repositories\Contracts\AssessmentPeriodRepository;
use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use GGPHP\ChildDevelop\Category\Presenters\AssessmentPeriodPresenter;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class AssessmentPeriodRepositoryEloquent extends BaseRepository implements AssessmentPeriodRepository
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
        return AssessmentPeriod::class;
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
        return AssessmentPeriodPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereLike('Name', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $assessmentPeriod = $this->paginate($attributes['limit']);
        } else {
            $assessmentPeriod = $this->get();
        }

        return $assessmentPeriod;
    }

    public function create(array $attributes)
    {
        $code = AssessmentPeriod::max('Code');

        if (is_null($code)) {
            $attributes['Code'] = AssessmentPeriod::CODE . "1";
        } else {
            $stt = substr($code, 2) + 1;
            $attributes['Code'] = AssessmentPeriod::CODE . "$stt";
        }

        $assessmentPeriod = AssessmentPeriod::create($attributes);

        if (!empty($attributes['classesId'])) {
            $assessmentPeriod->classes()->sync($attributes['classesId']);
        }

        return parent::all();
    }

    public function update(array $attributes, $id)
    {
        $assessmentPeriod = AssessmentPeriod::find($id);
        $assessmentPeriod->update($attributes);

        if (!empty($attributes['classesId'])) {
            $assessmentPeriod->classes()->detach();
            $assessmentPeriod->classes()->sync($attributes['classesId']);
        }

        return parent::find($id);
    }

    public function delete($id)
    {
        $assessmentPeriod = AssessmentPeriod::find($id);
        $assessmentPeriod->classes()->detach();
        $assessmentPeriod->delete();

        return $this->parserResult($assessmentPeriod);
    }
}
