<?php

namespace GGPHP\InterviewManager\Repositories\Eloquents;

use Carbon\Carbon;
use Exception;
use GGPHP\Clover\Models\EmployeeAccount;
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

        if (!empty($attributes['status'])) {
            $this->model = $this->model->where(function ($query) use ($attributes) {
                $query->orWhereLike('Status', $attributes['status']);
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

        $this->sentNotification($result);

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
    // gửi đề xuất lương đã phỏng vấn
    public function sendSuggestions(array $attributes, $id)
    {
        $attributes['status'] = InterviewList::STATUS['PENDING'];
        $interviewerList = InterviewList::findOrfail($id);

        $interviewerList->update($attributes);

        return parent::find($id);
    }

    // gửi đề xuất lương không duyệt lương
    public function sendSuggestionDoNotApprove(array $attributes, $id)
    {
        $attributes['status'] = InterviewList::STATUS['PENDING'];
        $interviewerList = InterviewList::findOrfail($id);

        $interviewerList->update($attributes);

        return parent::find($id);
    }

    // làm đánh giá của từng nhân viên
    public function completeInterview(array $attributes, $id)
    {
        $interviewList = InterviewList::findOrfail($id);
        $arrayInterviewDetail = [];

        if (!empty($attributes['interviewDetails'])) {
            $interviewDetail['interviewListId'] = $id;
            $interviewDetail['EmployeeId'] = $attributes['employeeId'];
            if (!empty($attributes['interviewDetails'])) {
                foreach ($attributes['interviewDetails'] as $key => $interviewDetailItem) {
                    $interviewDetail['evaluationCriteriaId'] = $interviewDetailItem['evaluationCriteriaId'];
                    $interviewDetail['pointEvaluation'] = $interviewDetailItem['pointEvaluation'];
                    $interviewDetail['comment'] = $interviewDetailItem['comment'];
                    $interviewDetail['status'] = InterviewDetail::STATUS['HAVE_EVALUATED'];
                    $arrayInterviewDetail[] = $interviewDetail;
                }
            }
        }

        if (!empty($arrayInterviewDetail)) {
            $sum = 0;
            $poinEvaluetionId = null;
            foreach ($arrayInterviewDetail as $key => $value) {
                $sum = $sum + $value['pointEvaluation'];
            }
            $avg = number_format($sum / count($arrayInterviewDetail), 2);

            // diem danh gia
            $pointValue = PointEvaluation::all()->toArray();

            if (!empty($pointValue)) {
                for ($i = 1; $i < count($pointValue); $i++) {
                    $prevPointFrom = $pointValue[$i - 1]["PointFrom"];
                    $currentPointFrom = $pointValue[$i]["PointFrom"];
                    if ($avg >= $prevPointFrom && $avg < $currentPointFrom) {
                        $poinEvaluetionId =  $pointValue[$i - 1]['Id'];
                    } elseif ($avg >= $currentPointFrom) {
                        $poinEvaluetionId =  $pointValue[$i]['Id'];
                    }
                }
            }

            foreach ($arrayInterviewDetail as $key => $value) {
                $arrayInterviewDetail[$key]['averageScoreAsAssessedByStaff'] = $avg;
                $arrayInterviewDetail[$key]['pointEvaluationId'] = $poinEvaluetionId;
                InterviewDetail::create($arrayInterviewDetail[$key]);
            }
        }
        // lấy ra để mục đích đếm số nhân viên đã đánh giá.
        $getEmployeeInterviewDetail = DB::table('InterviewDetails')->where('InterviewListId', $id)->distinct('EmployeeId')->get()->toArray();
        // Lấy ra với mục đích đếm số người phỏng vấn.
        $getEmployeeInterviewerListEmployee = DB::table('InterviewListEmployees')->select('EmployeeId')->get()->pluck('EmployeeId')->toArray();

        if (!empty($getEmployeeInterviewDetail) && !empty($getEmployeeInterviewerListEmployee)) {
            $sumInterviewList = 0;
            $pointEvaluationId = '';
            if (count($getEmployeeInterviewDetail) == count($getEmployeeInterviewerListEmployee)) {
                // lấy tổng điểm tất cả nhân viên đã đánh giá.
                foreach ($getEmployeeInterviewDetail as $key => $value) {
                    $sumInterviewList = $sumInterviewList + $value->AverageScoreAsAssessedByStaff;
                }
                $attributes['mediumScore'] = number_format($sumInterviewList / count($getEmployeeInterviewDetail), 2);

                // ddunwgs
                if (!empty($pointValue)) {
                    for ($i = 1; $i < count($pointValue); $i++) {
                        $prevPointFrom = $pointValue[$i - 1]["PointFrom"];
                        $currentPointFrom = $pointValue[$i]["PointFrom"];
                        if ($attributes['mediumScore'] >= $prevPointFrom && $attributes['mediumScore'] < $currentPointFrom) {
                            $pointEvaluationId =  $pointValue[$i - 1]['Id'];
                        } elseif ($attributes['mediumScore'] >= $currentPointFrom) {
                            $pointEvaluationId =  $pointValue[$i]['Id'];
                        }
                    }
                }
                $attributes['pointEvaluationId'] = $pointEvaluationId;
                $attributes['status'] = InterviewList::STATUS['INTERVIEWED'];
                $interviewList->update($attributes);
            }
        }

        return parent::parserResult($interviewList);
    }
    // duyệt lương bới ceo
    public function salaryApproval(array $attributes, $id)
    {
        if ($attributes['flag'] == InterviewList::STATUS['APPROVED']) {
            $attributes['status'] = InterviewList::STATUS['APPROVED'];
        }

        if ($attributes['flag'] == InterviewList::STATUS['NO_SALARY_APPROVAL']) {
            $attributes['status'] = InterviewList::STATUS['NO_SALARY_APPROVAL'];
        }

        if ($attributes['flag'] == InterviewList::STATUS['DO_NOT_APPROVECANDIDATES']) {
            $attributes['status'] = InterviewList::STATUS['DO_NOT_APPROVECANDIDATES'];
        }

        $interviewerList = InterviewList::findOrfail($id);

        $interviewerList->update($attributes);

        return parent::find($id);
    }

    public function sentNotification($model)
    {
        if (!empty($model)) {
        $arrayUserId = $model->interviewListEmployee()->get()->pluck('Id')->toArray();
        $UserId = EmployeeAccount::whereIn('EmployeeId', $arrayUserId)->get()->pluck('AppUserId')->toArray();

            $dataNotifiCation = [
                'users' => $UserId,
                'title' => $model->InterviewName,
                'imageURL' => '',
                'message' => 'Có lịch phỏng vấn vị trí'. $model->Location,
                'moduleType' => 33,
                'refId' => $model->Id,
            ];

            dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotifiCation));
        }
    }
}
