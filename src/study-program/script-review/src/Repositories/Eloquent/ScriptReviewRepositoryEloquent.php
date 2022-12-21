<?php

namespace GGPHP\StudyProgram\ScriptReview\Repositories\Eloquent;

use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewComment;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewCommentDetail;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubject;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetail;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReviewSubjectDetailChildren;
use GGPHP\StudyProgram\ScriptReview\Presenters\ScriptReviewPresenter;
use GGPHP\StudyProgram\ScriptReview\Repositories\Contracts\ScriptReviewRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class ScriptReviewRepositoryEloquent extends BaseRepository implements ScriptReviewRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ScriptReview::class;
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
        return ScriptReviewPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['type'])) {
            $this->model = $this->model()::where('Type', $attributes['type']);
        }

        if (!empty($attributes['nameAssessmentPeriodId'])) {
            $this->model = $this->model()::where('NameAssessmentPeriodId', $attributes['nameAssessmentPeriodId']);
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->model = $this->model()::where('SchoolYearId', $attributes['schoolYearId']);
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model()::whereHas('branch', function ($query) use ($attributes) {
                $query->where('BranchId', $attributes['branchId']);
            });
        }

        if (!empty($attributes['classId'])) {
            $this->model = $this->model()::whereHas('classes', function ($query) use ($attributes) {
                $query->where('ClassId', $attributes['classId']);
            });
        }

        if (!empty($attributes['limit'])) {
            $result = $this->paginate($attributes['limit']);
        } else {
            $result = $this->get();
        }

        return $result;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $result = $this->model()::create($attributes);

            if (!empty($attributes['branchId'])) {
                $result->branch()->attach($attributes['branchId']);
            }

            if (!empty($attributes['classId'])) {
                $result->classes()->attach($attributes['classId']);
            }

            if (!empty($attributes['subject'])) {
                $this->createScriptReviewSubject($result, $attributes['subject']);
            }

            if (!empty($attributes['comment'])) {
                $this->createScriptReviewComment($result, $attributes['comment']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function updateAll(array $attributes, $id)
    {
        $result = $this->model()::find($id);
        DB::beginTransaction();
        try {
            $result->update($attributes);

            if (!empty($attributes['branchId'])) {
                $result->branch()->detach();
                $result->branch()->attach($attributes['branchId']);
            }

            if (!empty($attributes['classId'])) {
                $result->classes()->detach();
                $result->classes()->attach($attributes['classId']);
            }

            if (!empty($attributes['subject'])) {
                $this->createScriptReviewSubject($result, $attributes['subject']);
            }

            if (!empty($attributes['comment'])) {
                $this->createScriptReviewComment($result, $attributes['comment']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function createScriptReviewSubject($model, $attributes)
    {
        foreach ($attributes as $key => $valueSubject) {

            if (!empty($valueSubject['id'])) {
                $scriptReviewSubject = ScriptReviewSubject::find($valueSubject['id']);

                if (!is_null($scriptReviewSubject)) {
                    $scriptReviewSubject->update($valueSubject);
                }
            } else {
                $valueSubject['scriptReviewId'] = $model->Id;
                $scriptReviewSubject = ScriptReviewSubject::create($valueSubject);
            }

            if (!empty($valueSubject['subjectSection'])) {
                $this->createScriptReviewSubjectDetail($scriptReviewSubject, $valueSubject['subjectSection']);
            }
        }
    }

    public function createScriptReviewSubjectDetail($model, $attributes)
    {
        foreach ($attributes as $valueSubjectSection) {

            if (!empty($valueSubjectSection['id'])) {
                $scriptReviewSubjectDetail = ScriptReviewSubjectDetail::find($valueSubjectSection['id']);
                if (!is_null($scriptReviewSubjectDetail)) {
                    $scriptReviewSubjectDetail->update($valueSubjectSection);
                }
            } else {
                $valueSubjectSection['scriptReviewSubjectId'] = $model->Id;
                $scriptReviewSubjectDetail = ScriptReviewSubjectDetail::create($valueSubjectSection);
            }

            if (!empty($valueSubjectSection['detail'])) {
                $this->createScriptReviewSubjectDetailChildren($scriptReviewSubjectDetail, $valueSubjectSection['detail']);
            }
        }
    }

    public function createScriptReviewSubjectDetailChildren($model, $attributes)
    {
        foreach ($attributes as $valueDetail) {

            if (!empty($valueDetail['id'])) {
                $detailChildren = ScriptReviewSubjectDetailChildren::find($valueDetail['id']);
                if (!is_null($detailChildren)) {
                    $detailChildren->update($valueDetail);
                }
            } else {
                $valueDetail['scriptReviewSubjectDetailId'] = $model->Id;
                ScriptReviewSubjectDetailChildren::create($valueDetail);
            }
        }
    }

    public function createScriptReviewComment($model, $attributes)
    {
        foreach ($attributes as $valueComment) {

            if (!empty($valueComment['id'])) {
                $comment = ScriptReviewComment::find($valueComment['id']);
                if (!is_null($comment)) {
                    $comment->update($valueComment);
                }
            } else {
                $valueComment['scriptReviewId'] = $model->Id;
                $comment = ScriptReviewComment::create($valueComment);
            }

            if (!empty($valueComment['commentDetail'])) {
                $this->createCommentDetail($comment, $valueComment['commentDetail']);
            }
        }
    }

    public function createCommentDetail($model, $attributes)
    {
        foreach ($attributes as $valueDetail) {

            if (!empty($valueDetail['id'])) {
                $commentDetail = ScriptReviewCommentDetail::find($valueDetail['id']);
                if (!is_null($commentDetail)) {
                    $commentDetail->update($valueDetail);
                }
            } else {
                $valueDetail['ScriptReviewCommentId'] = $model->Id;
                ScriptReviewCommentDetail::create($valueDetail);
            }
        }
    }

    public function deleteAll($id)
    {
        DB::beginTransaction();
        try {
            $data = $this->model()::find($id);
            $subject = $data->scriptReviewSubject()->with('scriptReviewSubjectDetail.scriptReviewSubjectDetailChildren')->get();
            $comment = $data->scriptReviewComment()->with('scriptReviewCommentDetail')->get();

            if (!empty($subject)) {
                foreach ($subject as $key => $valueSubject) {
                    foreach ($valueSubject->scriptReviewSubjectDetail as $key => $value) {
                        $value->scriptReviewSubjectDetailChildren()->delete();
                    }
                    $valueSubject->scriptReviewSubjectDetail()->delete();
                }

                $data->scriptReviewSubject()->delete();
            }

            if (!empty($comment)) {
                foreach ($comment as $key => $value) {
                    $value->scriptReviewCommentDetail()->delete();
                }
                $data->scriptReviewComment()->delete();
            }

            $data->branch()->detach();
            $data->classes()->detach();
            $data->delete();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }
}
