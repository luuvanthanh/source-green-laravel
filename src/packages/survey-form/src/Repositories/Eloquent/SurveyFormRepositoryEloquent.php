<?php

namespace GGPHP\SurveyForm\Repositories\Eloquent;

use GGPHP\SurveyForm\Models\SurveyForm;
use GGPHP\SurveyForm\Presenters\SurveyFormPresenter;
use GGPHP\SurveyForm\Repositories\Contracts\SurveyFormRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class SurveyFormRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class SurveyFormRepositoryEloquent extends BaseRepository implements SurveyFormRepository
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
        return SurveyForm::class;
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
        return SurveyFormPresenter::class;
    }

    public function getSurveyForm(array $attributes)
    {
        if (empty($attributes['limit'])) {
            $result = $this->all();
        } else {
            $result = $this->paginate($attributes['limit']);
        }

        return $result;
    }
}
