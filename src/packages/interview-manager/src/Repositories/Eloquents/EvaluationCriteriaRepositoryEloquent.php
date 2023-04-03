<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\RefundDetail;
use GGPHP\InterviewManager\Presenters\EvaluationCriteriaPresenter;
use GGPHP\InterviewManager\Repositories\Contracts\EvaluationCriteriaRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\InterviewManager\Repositories\Eloquents;
 */
class EvaluationCriteriaRepositoryEloquent extends CoreRepositoryEloquent implements EvaluationCriteriaRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return EvaluationCriteria::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return EvaluationCriteriaPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Get all entity in repository
     * @param  array  $attributes attributes from request
     * @return object
     */
    public function index(array $attributes)
    {
        if (!empty($attributes['key'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Code', $attributes['key']);
                $query->orWhereLike('Name', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }

    public function create(array $attributes)
    {
        $attributes = $this->creating($attributes);
        
        $result = EvaluationCriteria::create($attributes);

        return parent::parserResult($result);
    }

    public function creating($attributes)
    {
        $code = EvaluationCriteria::latest()->first();

        if (is_null($code)) {
            $code = EvaluationCriteria::CODE . '001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = EvaluationCriteria::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = EvaluationCriteria::CODE . '0' . $stt;
            } else {
                $code = EvaluationCriteria::CODE . $stt;
            }
        }
        $attributes['code'] = $code;

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        $evaluationCriteria = EvaluationCriteria::findOrfail($id);

        $evaluationCriteria->update($attributes);

        return parent::find($id);
    }
}
