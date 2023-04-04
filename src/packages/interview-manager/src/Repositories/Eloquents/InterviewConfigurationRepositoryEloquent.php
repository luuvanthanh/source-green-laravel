<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\InterviewConfiguration;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\InterviewManager\Presenters\InterviewConfigurationPresenter;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewConfigurationRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\InterviewManager\Repositories\Eloquents;
 */
class InterviewConfigurationRepositoryEloquent extends CoreRepositoryEloquent implements InterviewConfigurationRepository
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
        return InterviewConfiguration::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return InterviewConfigurationPresenter::class;
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
        DB::beginTransaction();
        try {
            $attributes = $this->creating($attributes);

            $result = InterviewConfiguration::create($attributes);

            if (!is_null($result) && !empty($attributes['data'])) {
                $result->interviewConfigurationEvaluationCriteria()->attach($attributes['data']);
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return parent::parserResult($result);
    }

    public function creating($attributes)
    {
        $code = InterviewConfiguration::latest()->first();

        if (is_null($code)) {
            $code = InterviewConfiguration::CODE . '001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = InterviewConfiguration::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = InterviewConfiguration::CODE . '0' . $stt;
            } else {
                $code = InterviewConfiguration::CODE . $stt;
            }
        }
        $attributes['code'] = $code;

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try { 
            $interviewer = InterviewConfiguration::findOrfail($id);

            $interviewer->update($attributes);

            if (!empty($attributes['data'])) {
                $interviewer->interviewConfigurationEvaluationCriteria()->detach();
                $interviewer->interviewConfigurationEvaluationCriteria()->attach($attributes['data']);
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return parent::find($id);
    }
}
