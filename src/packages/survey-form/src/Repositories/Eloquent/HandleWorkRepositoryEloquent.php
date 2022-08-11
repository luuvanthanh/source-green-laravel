<?php

namespace GGPHP\SurveyForm\Repositories\Eloquent;

use GGPHP\SurveyForm\Models\HandleWork;
use GGPHP\SurveyForm\Presenters\HandleWorkPresenter;
use GGPHP\SurveyForm\Repositories\Contracts\HandleWorkRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class HandleWorkRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class HandleWorkRepositoryEloquent extends BaseRepository implements HandleWorkRepository
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
        return HandleWork::class;
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
        return HandleWorkPresenter::class;
    }

    public function getHandleWork(array $attributes)
    {
        if (!empty($attributes['survey_id'])) {
            $surveyId = explode(',', $attributes['survey_id']);
            $this->model = $this->model->where('survey_id', $surveyId);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function create(array $attributes)
    {
        $handleWork = $this->model()::create($attributes);

        if (!empty($attributes['files'])) {
            $handleWork->addMediaToEntity($handleWork, $attributes['files'], 'files');
        }

        return parent::find($handleWork->id);
    }

    public function update(array $attributes, $id)
    {
        $handleWork = $this->model()::findOrFail($id);

        $handleWork->update($attributes);

        if (!empty($attributes['files'])) {
            $handleWork->clearMediaCollection('files');
            $handleWork->addMediaToEntity($handleWork, $attributes['files'], 'files');
        }

        return parent::find($handleWork->id);
    }
}
