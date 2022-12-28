<?php

namespace GGPHP\StudyProgram\MonthlyComment\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetail;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetailSubject;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetailSubjectChildren;
use GGPHP\StudyProgram\MonthlyComment\Presenters\MonthlyCommentPresenter;
use GGPHP\StudyProgram\MonthlyComment\Repositories\Contracts\MonthlyCommentRepository;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class MonthlyCommentRepositoryEloquent extends BaseRepository implements MonthlyCommentRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];

    protected $studentRepositoryEloquent;

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Container $app
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return MonthlyComment::class;
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
        return MonthlyCommentPresenter::class;
    }

    public function getAll(array $attributes)
    {
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', Student::OFFICAL);

        if (!empty($attributes['month'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
                $query->where('Month', $attributes['month']);
            });
        }

        if (!empty($attributes['classId'])) {
            $arrayClass = explode(',', $attributes['classId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereIn('ClassId', $arrayClass);
        }

        if (!empty($attributes['branchId'])) {
            $arrayBranch = explode(',', $attributes['branchId']);
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classes', function ($q) use ($arrayBranch) {
                $q->whereIn('BranchId', $arrayBranch);
            });
        }

        if (!empty($attributes['key'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereLike('FullName', $attributes['key']);
        }

        if (!empty($attributes['scriptReviewId']) && !empty($attributes['status']) && $attributes['status'] != MonthlyComment::STATUS['NOT_REVIEW']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('ScriptReviewId', $attributes['scriptReviewId']);
            });
        }

        if (!empty($attributes['status']) && $attributes['status'] == MonthlyComment::STATUS['NOT_REVIEW'] && !empty($attributes['scriptReviewId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereDoesntHave('quarterReport', function ($query) use ($attributes) {

                if (!empty($attributes['scriptReviewId'])) {
                    $query->where('ScriptReviewId', $attributes['scriptReviewId']);
                }

                $query->orderBy('CreationTime', 'DESC');
            });
        }

        if (!empty($attributes['status']) && $attributes['status'] != MonthlyComment::STATUS['NOT_REVIEW']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['quarterReport' => function ($query) use ($attributes) {
                $query->where('Status', $attributes['status']);
            }])->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('Status', $attributes['status']);
            });
        }

        if (!empty($attributes['type']) && !empty($attributes['status']) && $attributes['status'] == MonthlyComment::STATUS['CONFIRMED']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['quarterReport' => function ($query) use ($attributes) {
                $query->where('Type', $attributes['type'])->where('Status', $attributes['status']);
            }])->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('Type', $attributes['type'])->where('Status', $attributes['status']);
            });
        }

        if (!empty($attributes['studentId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('StudentId', $attributes['studentId']);
            });
        }

        if (!empty($attributes['limit'])) {
            $student = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $student = $this->studentRepositoryEloquent->paginate(50);
        }

        return $student;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $attributes['month'] = now()->format('Y-m-d H:i:s');

            if ($attributes['status'] == MonthlyComment::STATUS['REVIEWED']) {
                $attributes['reportTime'] = now()->format('Y-m-d H:i:s');

                $quarterReportId = '';
                for ($i = 1; $i <= 2; $i++) {
                    switch ($i) {
                        case 1:
                            $attributes['status'] = MonthlyComment::STATUS['REVIEWED'];
                            break;
                        case 2:
                            $attributes['status'] = MonthlyComment::STATUS['NOT_YET_CONFIRM'];
                            $attributes['quarterReportId'] = $quarterReportId;
                            $attributes['type'] = MonthlyComment::TYPE['DUPLICATE'];
                            break;
                    }
                    $result = $this->model()::create($attributes);
                    $quarterReportId = $result->Id;

                    if (!empty($attributes['detail'])) {
                        $this->createDetail($result, $attributes['detail']);
                    }
                }
            } else {
                $result = $this->model()::create($attributes);
                if (!empty($attributes['detail'])) {
                    $this->createDetail($result, $attributes['detail']);
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::parserResult($result);
    }

    public function createDetail($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['monthlyCommentId'] = $model->Id;
            $monthlyCommentDetail = MonthlyCommentDetail::create($value);

            if (!empty($value['detailSubject'])) {
                $this->createDetailSubject($monthlyCommentDetail, $value['detailSubject']);
            }
        }
    }

    public function createDetailSubject($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['monthlyCommentDetailId'] = $model->Id;
            $monthlyCommentDetailSubject = MonthlyCommentDetailSubject::create($value);

            if (!empty($value['detailSubjectChildren'])) {
                $this->createDetailSubjectChildren($monthlyCommentDetailSubject, $value['detailSubjectChildren']);
            }
        }
    }

    public function createDetailSubjectChildren($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['monthlyCommentDetailSubjectId'] = $model->Id;
            MonthlyCommentDetailSubjectChildren::create($value);
        }
    }

    public function updateAll($attributes, $id)
    {
        $result = $this->model()::find($id);
        DB::beginTransaction();
        try {
            if ($attributes['status'] == MonthlyComment::STATUS['CONFIRMED']) {
                $attributes['confirmationTime'] = now()->format('Y-m-d H:i:s');
            }

            if ($attributes['status'] == MonthlyComment::STATUS['SENT']) {
                $attributes['SentTime'] = now()->format('Y-m-d H:i:s');
            }
            $result->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->updateDetail($attributes['detail']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function updateStatusMonthlyComment(array $attributes)
    {
        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('SampleCommentId', $attributes['sampleCommentId'])
            ->update([
                'Status' => $attributes['status']
            ]);

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function notificationMonthlyComment(array $attributes)
    {
        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('SampleCommentId', $attributes['sampleCommentId'])
            ->update([
                'Status' => $attributes['status']
            ]);
        $data = $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('SampleCommentId', $attributes['sampleCommentId'])->get();

        foreach ($data as $value) {

            $student = $value->student;
            $parent = $student->parent()->with('account')->get();

            if (!empty($parent)) {
                $arrId = array_column(array_column($parent->ToArray(), 'account'), 'AppUserId');
                $images =  json_decode($student->FileImage);
                $urlImage = '';

                if (!empty($images)) {
                    $urlImage = env('IMAGE_URL') . $images[0];
                }

                $month = Carbon::parse($value->Month)->format('m');
                $schoolYear = $value->schoolYear->YearFrom . '-' . $value->schoolYear->YearTo;

                $message = $student->FullName . ' ' . 'nhận monthly comment ' . $month . ' school year ' . $schoolYear;

                if (!empty($arrId)) {
                    $dataNotiCation = [
                        'users' => $arrId,
                        'title' => 'English',
                        'imageURL' => $urlImage,
                        'message' => $message,
                        'moduleType' => 25,
                        'refId' => $value->Id,
                    ];

                    dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotiCation));
                }
            }
        }

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function updateAllStatusMonthlyComment($attributes)
    {
        $data = $this->getAll($attributes);

        foreach ($data['data'] as $value) {
            $this->model()::where('StudentId', $value['id'])->where('ScriptReviewId', $attributes['scriptReviewId'])
                ->update([
                    'Status' => $attributes['newStatus']
                ]);
        }

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function notificationAllStatusMonthlyComment($attributes)
    {
        $data = $this->getAll($attributes);

        foreach ($data['data'] as $value) {
            $monthlyComment =  $this->model()::where('StudentId', $value['id'])->where('ScriptReviewId', $attributes['scriptReviewId'])->first();
            $student = $monthlyComment->student;
            $parent = $student->parent()->with('account')->get();

            if (!empty($parent)) {
                $arrId = array_column(array_column($parent->ToArray(), 'account'), 'AppUserId');
                $images =  json_decode($student->FileImage);
                $urlImage = '';

                if (!empty($images)) {
                    $urlImage = env('IMAGE_URL') . $images[0];
                }

                $schoolYear = $monthlyComment->scriptReview->schoolYear->YearFrom . '-' . $monthlyComment->scriptReview->schoolYear->YearTo;
                $name = $monthlyComment->scriptReview->NameAssessmentPeriod->Name;

                $message = $student->FullName . ' ' . 'nhận Monthly Comment ' . $name . ' school year ' . $schoolYear;

                if (!empty($arrId)) {
                    $dataNotiCation = [
                        'users' => $arrId,
                        'title' => 'English',
                        'imageURL' => $urlImage,
                        'message' => $message,
                        'moduleType' => 25,
                        'refId' => $monthlyComment->Id,
                    ];

                    dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotiCation));
                }
            }

            $monthlyComment->update([
                'Status' => $attributes['newStatus']
            ]);
        }

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function sentNotification($model)
    {
        $student = $model->student;
        $parent = $student->parent()->with('account')->get();

        if (!empty($parent)) {
            $arrId = array_column(array_column($parent->ToArray(), 'account'), 'AppUserId');

            $images =  json_decode($student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }

            $schoolYear = $model->scriptReview->schoolYear->YearFrom . '-' . $model->scriptReview->schoolYear->YearTo;
            $name = $model->scriptReview->NameAssessmentPeriod->Name;

            $message = $student->FullName . ' ' . 'nhận Quarter report ' . $name . ' school year ' . $schoolYear;

            if (!empty($arrId)) {
                $dataNotiCation = [
                    'users' => $arrId,
                    'title' => 'English',
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 25,
                    'refId' => $model->Id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotiCation));
            }
        }
    }
}
