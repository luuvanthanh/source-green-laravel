<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Carbon\Carbon;
use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\InterviewManager\Models\InterviewList;
use GGPHP\InterviewManager\Presenters\InterviewListPresenter;
use GGPHP\InterviewManager\Repositories\Contracts\InterviewListRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Criteria\RequestCriteria;
use Throwable;

/**
 * Class RefundRepositoryEloquent.
 *
 * @package GGPHP\InterviewManager\Repositories\Eloquents;
 */
class InterviewListRepositoryEloquent extends CoreRepositoryEloquent implements InterviewListRepository
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
        return InterviewList::class;
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return InterviewListPresenter::class;
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
                $query->orWhereLike('InterviewName', $attributes['key']);
            })->orWhereHas('division', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
            })->orWhereHas('interviewConfiguration', function ($query) use ($attributes) {
                $query->whereLike('Name', $attributes['key']);
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

            $result = InterviewList::create($attributes);

            if (!is_null($result) && !empty($attributes['employees'])) {
                $result->interviewListEmployee()->attach($attributes['employees']);
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
            $code = InterviewList::CODE . '001';
        } else {
            $stt = substr($code->Code, 4);
            $stt += 1;

            if (strlen($stt) == 1) {
                $code = InterviewList::CODE . '00' . $stt;
            } elseif (strlen($stt) == 2) {
                $code = InterviewList::CODE . '0' . $stt;
            } else {
                $code = InterviewList::CODE . $stt;
            }
        }
        $attributes['code'] = $code;
        $attributes['date'] = Carbon::parse($attributes['date'])->format('Y-m-d');
        $attributes['status'] = InterviewList::STATUS['NOT_INTERVIEWED_YET'];

        return $attributes;
    }

    public function update(array $attributes, $id)
    {
        DB::beginTransaction();
        try {
            $interviewer = InterviewList::findOrfail($id);

            $interviewer->update($attributes);

            if (!empty($attributes['data'])) {
                $interviewer->interviewerEmployee()->detach();
                $interviewer->interviewerEmployee()->attach($attributes['data']);
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
        $interviewer = InterviewList::findOrfail($id);
        $interviewer->interviewerEmployee()->detach();
        
        $interviewer->delete();
    }
}
