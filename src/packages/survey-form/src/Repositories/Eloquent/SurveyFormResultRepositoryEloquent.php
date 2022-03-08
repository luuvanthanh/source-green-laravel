<?php

namespace GGPHP\SurveyForm\Repositories\Eloquent;

use GGPHP\Notification\Services\NotificationService;
use GGPHP\SurveyForm\Models\SurveyFormResult;
use GGPHP\SurveyForm\Presenters\SurveyFormResultPresenter;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormResultRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SurveyFormResultRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SurveyFormResultRepositoryEloquent extends BaseRepository implements SurveyFormResultRepository
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
        return SurveyFormResult::class;
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
        return SurveyFormResultPresenter::class;
    }

    public function getSurveyFormResult(array $attributes)
    {
        if (!empty($attributes['start_time']) && !empty($attributes['end_time'])) {
            $this->model = $this->model->where('created_at', '>=', $attributes['start_time'])->where('created_at', '<=', $attributes['end_time']);
        }

        if (!empty($attributes['survey_form_id'])) {
            $this->model = $this->model->where('survey_id', $attributes['survey_form_id']);
        }

        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }

    public function create($attributes)
    {
        $surveyForm = $this->model()::create($attributes);

        NotificationService::surveyFormCreated('SURVEYFORM', $surveyForm);

        return parent::find($surveyForm->id);
    }
}
