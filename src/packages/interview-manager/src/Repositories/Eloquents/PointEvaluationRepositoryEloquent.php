<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\PointEvaluation;
use GGPHP\InterviewManager\Presenters\PointEvaluationPresenter;
use GGPHP\InterviewManager\Repositories\Contracts\PointEvaluationRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\InterviewManager\Repositories\Eloquents;
 */
class PointEvaluationRepositoryEloquent extends CoreRepositoryEloquent implements PointEvaluationRepository
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
        return PointEvaluation::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return PointEvaluationPresenter::class;
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
        if (!empty($attributes['limit'])) {
            $results = $this->paginate($attributes['limit']);
        } else {
            $results = $this->get();
        }

        return $results;
    }

    public function create(array $attributes)
    {
        if (!empty($attributes['data'])) {
            $result = DB::table('PointEvaluations')->delete();
            
            foreach ($attributes['data'] as $key => $value) {
                $result = PointEvaluation::create($value);
            }
        }
        $result = PointEvaluation::get();

        return parent::parserResult($result);
    }
}
