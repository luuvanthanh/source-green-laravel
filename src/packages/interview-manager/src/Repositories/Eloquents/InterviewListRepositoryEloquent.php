<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Carbon\Carbon;
use Exception;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\InterviewManager\Models\InterviewDetail;
use GGPHP\InterviewManager\Models\Interviewer;
use GGPHP\InterviewManager\Models\InterviewList;
use GGPHP\InterviewManager\Models\PointEvaluation;
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

            if (!is_null($result) && !empty($attributes['employeeId'])) {
                $result->interviewListEmployee()->attach($attributes['employeeId']);
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
        $code = InterviewList::latest()->first();

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

            if (!is_null($interviewer) && !empty($attributes['employeeId'])) {
                $interviewer->interviewListEmployee()->detach();
                $interviewer->interviewListEmployee()->attach($attributes['employeeId']);
            }

            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage(), $th->getCode());
        }

        return parent::find($id);
    }

    public function sendSuggestions(array $attributes, $id)
    {
        $attributes['status'] = InterviewList::STATUS['PENDING'];
        $interviewerList = InterviewList::findOrfail($id);

        $interviewerList->update($attributes);

        return parent::find($id);
    }

    public function sendSuggestionDoNotApprove(array $attributes, $id)
    {
        $attributes['status'] = InterviewList::STATUS['PENDING'];
        $interviewerList = InterviewList::findOrfail($id);

        $interviewerList->update($attributes);

        return parent::find($id);
    }
    
    public function completeInterview(array $attributes, $id)
    {
        dd($attributes);
        $interviewList = InterviewList::findOrfail($id);
        if (!empty($attributes['pointEvaluation'])) {
            foreach ($attributes['pointEvaluation'] as $key => $value) {
               $interviewDetail['interviewListId'] = $id;
               $interviewDetail['pointEvaluation'] = $value;
               $interviewDetail['comment'] = $attributes['pointEvaluation'][$key];

                InterviewDetail::create($interviewDetail);
            }
        }

        $listInterViewDetail = InterviewDetail::where('InterviewListId', $id)->get()->toArray();
        $sum = 0;

        if (!empty($listInterViewDetail)) {
            foreach ($listInterViewDetail as $key => $value) {
                $sum = $sum + $value['PointEvaluation'];
            }
        }
        // trung binh cong
        $attributes['mediumScore'] = number_format($sum / count($listInterViewDetail), 2);
        // diem danh gia
        $pointValue = PointEvaluation::all()->toArray();

        if (!empty($pointValue)) {
            foreach ($pointValue as $key => $value) {
                if ($attributes['mediumScore'] >= $value['PointFrom'] && $attributes['mediumScore'] <= $value['PointTo']) {
                    $attributes['PointEvaluationId'] =  $value['Id'];
                }
            }
        }

        $interviewList->update($attributes);

        return parent::find($id);
    }
}
