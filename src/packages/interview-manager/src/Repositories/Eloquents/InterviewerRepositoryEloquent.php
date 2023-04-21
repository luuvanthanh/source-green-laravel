<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\EvaluationCriteria;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\InterviewManager\Presenters\InterviewerPresenter;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewerRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\InterviewManager\Repositories\Eloquents;
 */
class InterviewerRepositoryEloquent extends CoreRepositoryEloquent implements InterviewerRepository
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
        return Interviewer::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return InterviewerPresenter::class;
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
            })->orWhereHas('division', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            })->orWhereHas('interviewerEmployee', function ($query) use ($attributes) {
                $query->whereLike('FullName', $attributes['key']);
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

            $result = Interviewer::create($attributes);

            if (!is_null($result) && !empty($attributes['employeeId'])) {
                $result->interviewerEmployee()->attach($attributes['employeeId']);
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
        $code = Interviewer::latest()->first();

        if (is_null($code)) {
            $code = Interviewer::CODE . '001';
        } else {
            $stt = substr($code->Code, 3);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = Interviewer::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = Interviewer::CODE . '0' . $stt;
            } else {
                $code = Interviewer::CODE . $stt;
            }
        }
        $attributes['code'] = $code;

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $interviewer = Interviewer::findOrfail($id);

            $interviewer->update($attributes);

            if (!empty($attributes['data'])) {
                $interviewer->interviewerEmployee()->detach();
                $interviewer->interviewerEmployee()->attach($attributes['employeeId']);
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return parent::find($id);
    }

    public function delete($id)
    {
        $interviewer = Interviewer::findOrfail($id);
        $interviewer->interviewerEmployee()->detach();
        
        $interviewer->delete();
    }
}
