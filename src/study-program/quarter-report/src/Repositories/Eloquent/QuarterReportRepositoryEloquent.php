<?php

namespace GGPHP\StudyProgram\QuarterReport\Repositories\Eloquent;

use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\StudyProgram\QuarterReport\Criteria\QuarterReportCriteriaCriteria;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetail;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubject;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildren;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReportDetailSubjectChildrens;
use GGPHP\StudyProgram\QuarterReport\Presenters\QuarterReportPresenter;
use GGPHP\StudyProgram\QuarterReport\Repositories\Contracts\QuarterReportRepository;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Container\Container as Application;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class QuarterReportRepositoryEloquent extends BaseRepository implements QuarterReportRepository
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
        Application $app
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
        return QuarterReport::class;
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
        return QuarterReportPresenter::class;
    }

    public function getAll(array $attributes)
    {
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', Student::OFFICAL);

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

        if (!empty($attributes['scriptReviewId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('ScriptReviewId', $attributes['scriptReviewId']);
            });
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('SchoolYearId', $attributes['schoolYearId']);
            });
        }

        if (!empty($attributes['status'])) {
            $status = $this->model()::STATUS[$attributes['status']];
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['quarterReport' => function ($query) use ($status) {
                $query->where('Status', $status);
            }]);
        }

        if (!empty($attributes['studentId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('quarterReport', function ($query) use ($attributes) {
                $query->where('StudentId', $attributes['studentId']);
            });
        }

        if (!empty($attributes['limit'])) {
            $student = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $student = $this->studentRepositoryEloquent->get();
        }

        return $student;
    }

    public function createAll(array $attributes)
    {
        DB::beginTransaction();
        try {
            $result = $this->model()::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->createDetail($result, $attributes['detail']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::parserResult($result);
    }

    public function createDetail($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['quarterReportId'] = $model->Id;
            $quarterReportDetail = QuarterReportDetail::create($value);

            if (!empty($value['detailSubject'])) {
                $this->createDetailSubject($quarterReportDetail, $value['detailSubject']);
            }
        }
    }

    public function createDetailSubject($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['quarterReportDetailId'] = $model->Id;
            $quarterReportDetailSubject = QuarterReportDetailSubject::create($value);

            if (!empty($value['detailSubjectChildren'])) {
                $this->createDetailSubjectChildren($quarterReportDetailSubject, $value['detailSubjectChildren']);
            }
        }
    }

    public function createDetailSubjectChildren($model, $attributes)
    {
        foreach ($attributes as $value) {
            $value['quarterReportDetailSubjectId'] = $model->Id;
            QuarterReportDetailSubjectChildren::create($value);
        }
    }

    public function updateAll($attributes, $id)
    {
        $result = $this->model()::find($id);
        DB::beginTransaction();
        try {
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
            $quarterReportDetail = QuarterReportDetail::find($value['id']);

            if (!is_null($quarterReportDetail)) {
                $quarterReportDetail->update($value);

                if (!empty($value['detailSubject'])) {
                    $this->updateDetailSubject($value['detailSubject']);
                }
            }
        }
    }

    public function updateDetailSubject($attributes)
    {
        foreach ($attributes as $key => $value) {
            $quarterReportDetailSubject = QuarterReportDetailSubject::find($value['id']);

            if (!is_null($quarterReportDetailSubject)) {
                $quarterReportDetailSubject->update($value);

                $this->updateDetailSubjectChildren($value['detailSubjectChildren']);
            }
        }
    }

    public function updateDetailSubjectChildren($attributes)
    {
        foreach ($attributes as $value) {
            $subjectChildren = QuarterReportDetailSubjectChildren::find($value['id']);

            if (!is_null($subjectChildren)) {
                $subjectChildren->update($value);
            }
        }
    }

    public function deleteAll($id)
    {
        DB::beginTransaction();
        try {
            $data = $this->model()::find($id);
            foreach ($data->quarterReportDetail as $key => $value) {
                foreach ($value->quarterReportDetailSubject as $key => $valueDetail) {
                    $valueDetail->quarterReportDetailSubjectChildren()->delete();
                }
                $value->quarterReportDetailSubject()->delete();
            }
            $data->quarterReportDetail()->delete();
            $data->delete();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::all();
    }

    public function updateStatus(array $attributes)
    {
        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReview'])
            ->update([
                'Status' => $attributes['status']
            ]);

        return parent::parserResult($this->model->orderBy('LastModificationTime', 'desc')->first());
    }

    public function notificationQuarterReport(array $attributes)
    {
        $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReviewId'])
            ->update([
                'Status' => $attributes['status']
            ]);

        $data = $this->model->whereIn('StudentId', $attributes['studentId'])
            ->where('SchoolYearId', $attributes['schoolYearId'])
            ->where('ScriptReviewId', $attributes['scriptReviewId'])->get();

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
                $schoolYear = $value->scriptReview->schoolYear->YearFrom . '-' . $value->scriptReview->schoolYear->YearTo;
                $name = $value->scriptReview->NameAssessmentPeriod->Name;

                $message = $student->FullName . ' ' . 'nhận Quarter report ' . $name . ' school year ' . $schoolYear;

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
}
