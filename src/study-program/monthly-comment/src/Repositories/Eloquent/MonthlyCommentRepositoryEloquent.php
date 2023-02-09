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

        if (!empty($attributes['status']) && $attributes['status'] != MonthlyComment::STATUS['NOT_REVIEW']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
                $query->where('Status', $attributes['status']);

                if (!empty($attributes['month'])) {
                    $query->where('Month', $attributes['month']);
                }

                if (!empty($attributes['scriptReviewId'])) {
                    $query->where('ScriptReviewId', $attributes['scriptReviewId']);
                }

                if (!empty($attributes['type'])) {
                    $query->where('Type', $attributes['type']);
                }

                if (!empty($attributes['studentId'])) {
                    $query->where('StudentId', $attributes['studentId']);
                }
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

        if (!empty($attributes['status']) && $attributes['status'] == MonthlyComment::STATUS['NOT_REVIEW']) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereDoesntHave('monthlyComment', function ($query) use ($attributes) {
                if (!empty($attributes['month'])) {
                    $query->where('Month', $attributes['month']);
                }
            });
        }

        if (!empty($attributes['studentId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
                $query->where('StudentId', $attributes['studentId']);
            });
        }

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['monthlyComment' => function ($query) use ($attributes) {
            if (!empty($attributes['scriptReviewId'])) {
                $query->where('ScriptReviewId', $attributes['scriptReviewId']);
            }

            if (!empty($attributes['type'])) {
                $query->where('Type', $attributes['type']);
            }

            if (!empty($attributes['status'])) {
                $query->where('Status', $attributes['status']);
            }

            if (!empty($attributes['month'])) {
                $query->where('Month', $attributes['month']);
            }
        }]);

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

            if ($attributes['status'] == MonthlyComment::STATUS['REVIEWED']) {
                $attributes['reportTime'] = now()->format('Y-m-d H:i:s');

                $monthlyCommentId = '';
                for ($i = 1; $i <= 2; $i++) {
                    switch ($i) {
                        case 1:
                            $attributes['status'] = MonthlyComment::STATUS['REVIEWED'];
                            break;
                        case 2:
                            $attributes['status'] = MonthlyComment::STATUS['NOT_YET_CONFIRM'];
                            $attributes['MonthlyCommentId'] = $monthlyCommentId;
                            $attributes['type'] = MonthlyComment::TYPE['DUPLICATE'];
                            break;
                    }
                    $result = $this->model()::create($attributes);
                    $monthlyCommentId = $result->Id;

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

    public function updateDetail($attributes)
    {
        foreach ($attributes as $value) {
            $detail = MonthlyCommentDetail::find($value['id']);

            if (!is_null($detail)) {
                $detail->update($value);

                if (!empty($value['detailSubject'])) {
                    $this->updateDetailSubject($value['detailSubject']);
                }
            }
        }
    }

    public function updateDetailSubject($attributes)
    {
        foreach ($attributes as $value) {
            $detailSubject = MonthlyCommentDetailSubject::find($value['id']);

            if (!is_null($detailSubject)) {
                $detailSubject->update($value);

                $this->updateDetailSubjectChildren($value['detailSubjectChildren']);
            }
        }
    }

    public function updateDetailSubjectChildren($attributes)
    {
        foreach ($attributes as $value) {
            $subjectChildren = MonthlyCommentDetailSubjectChildren::find($value['id']);

            if (!is_null($subjectChildren)) {
                $subjectChildren->update($value);
            }
        }
    }

    public function deleteAll($id)
    {
        $data = $this->model()::findOrFail($id);
        $data->monthlyCommentDetail()->forceDelete();
        $data->forceDelete();

        return parent::all();
    }

    public function updateStatusMonthlyComment(array $attributes)
    {
        $carbon = Carbon::parse($attributes['month']);

        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReviewId'])
            ->where('Status', $attributes['oldStatus'])
            ->whereMonth('Month', $carbon->format('m'))
            ->whereYear('Month', $carbon->format('Y'))
            ->update([
                'Status' => $attributes['newStatus'],
                'ConfirmationTime' => now()->format('Y-m-d H:i:s'),
                'TeacherManagementId' => $attributes['teacherManagementId']
            ]);

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function notificationMonthlyComment(array $attributes)
    {
        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReviewId'])
            ->where('Status', $attributes['oldStatus'])
            ->update([
                'Status' => $attributes['newStatus'],
                'SentTime' => now()->format('Y-m-d H:i:s'),
                'TeacherSentId' => $attributes['teacherSentId']
            ]);

        $data = $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReviewId'])
            ->where('Status', $attributes['newStatus'])
            ->get();

        foreach ($data as $value) {
            $this->sentNotification($value);
        }

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function updateAllStatusMonthlyComment($attributes)
    {
        $this->model->whereIn('Id', $attributes['id'])
            ->update([
                'Status' => $attributes['newStatus'],
                'ConfirmationTime' => now()->format('Y-m-d H:i:s'),
                'TeacherManagementId' => $attributes['teacherManagementId']
            ]);

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function notificationAllStatusMonthlyComment($attributes)
    {
        $data = $this->model->whereIn('Id', $attributes['id'])
            ->where('Status', $attributes['oldStatus'])->get();

        foreach ($data as $value) {
            $this->sentNotification($value);

            $value->update([
                'Status' => $attributes['newStatus'],
                'SentTime' => now()->format('Y-m-d H:i:s'),
                'TeacherSentId' => $attributes['teacherSentId']
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
            $month = Carbon::parse($model->Month)->format('m');

            $message = $student->FullName . ' ' . 'nhận monthly comment ' . $month . ' school year ' . $schoolYear;

            if (!empty($arrId)) {
                $dataNotifiCation = [
                    'users' => $arrId,
                    'title' => 'English',
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 25,
                    'refId' => $model->Id,
                ];

                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotifiCation));
            }
        }
    }

    public function deleteMonthlyComment($id)
    {
        $monthlyComment = $this->model()::findOrFail($id);
        DB::beginTransaction();
        try {
            $duplicate = $this->model()::where('Id', $monthlyComment->MonthlyCommentId)->first();

            if (!is_null($duplicate)) {
                $duplicate->forceDelete();
            }
            $monthlyComment->forceDelete();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function countStudentMonthlyCommentByStatus($attributes)
    {
        $quantityNotYetReview = Student::where('Status', Student::OFFICAL)->whereHas('classes', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
        })->where('ClassId', $attributes['classId'])->whereDoesntHave('monthlyComment', function ($query) use ($attributes) {

            if (!empty($attributes['month'])) {
                $query->where('Month', $attributes['month']);
            }

            $query->orderBy('CreationTime', 'DESC');
        })->count();

        $quantityDoneReview = Student::where('Status', Student::OFFICAL)->whereHas('classes', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
        })->where('ClassId', $attributes['classId'])->whereHas('monthlyComment', function ($query) use ($attributes) {
            $query->where('Month', $attributes['month'])->where('Status', MonthlyComment::STATUS['REVIEWED']);
        })->count();

        $quantityNotYetConfirm = Student::where('Status', Student::OFFICAL)->whereHas('classes', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
        })->where('ClassId', $attributes['classId'])->whereHas('monthlyComment', function ($query) use ($attributes) {
            $query->where('Month', $attributes['month'])->where('Status', MonthlyComment::STATUS['NOT_YET_CONFIRM']);
        })->count();

        $quantityDoneConfirm = Student::where('Status', Student::OFFICAL)->whereHas('classes', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
        })->where('ClassId', $attributes['classId'])->whereHas('monthlyComment', function ($query) use ($attributes) {
            $query->where('Month', $attributes['month'])->where('Status', MonthlyComment::STATUS['CONFIRMED']);
        })->count();

        $quantityDoneSend = Student::where('Status', Student::OFFICAL)->whereHas('classes', function ($query) use ($attributes) {
            $query->where('BranchId', $attributes['branchId']);
        })->where('ClassId', $attributes['classId'])->whereHas('monthlyComment', function ($query) use ($attributes) {
            $query->where('Month', $attributes['month'])->where('Status', MonthlyComment::STATUS['SENT']);
        })->count();

        $data = [
            'quantityNotYetReview' => $quantityNotYetReview,
            'quantityDoneReview' => $quantityDoneReview,
            'quantityNotYetConfirm' => $quantityNotYetConfirm,
            'quantityDoneConfirm' => $quantityDoneConfirm,
            'quantityNotYetSend' => $quantityDoneConfirm,
            'quantityDoneSend' => $quantityDoneSend
        ];

        return $data;
    }
}
