<?php

namespace GGPHP\StudyProgram\MonthlyComment\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyCommentDetail;
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

        if (!empty($attributes['monthlyComment'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
                $query->where('MonthlyComment', $attributes['monthlyComment']);
            });
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
                $query->where('SchoolYearId', $attributes['schoolYearId']);
            });
        }

        if (!empty($attributes['status'])) {
            $status = $this->model()::STATUS[$attributes['status']];
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->with(['monthlyComment' => function ($query) use ($status) {
                $query->where('Status', $status);
            }]);
        }

        if (!empty($attributes['studentId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('monthlyComment', function ($query) use ($attributes) {
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
            $data = $this->model()::create($attributes);

            if (!empty($attributes['detail'])) {
                $this->createDetail($data, $attributes['detail']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }
        return parent::parserResult($data);
    }

    public function createDetail($model, $attributes)
    {
        foreach ($attributes as $key => $value) {
            if (!empty($value['id'])) {
                $detail = MonthlyCommentDetail::find($value['id']);

                if (!is_null($detail)) {
                    $detail->update($value);
                }
            } else {
                $value['MonthlyCommentId'] = $model->Id;
                MonthlyCommentDetail::create($value);
            }
        }
    }

    public function updateAll(array $attributes, $id)
    {
        $result = $this->model()::find($id);
        DB::beginTransaction();
        try {
            $result->update($attributes);

            if (!empty($attributes['detail'])) {
                $this->createDetail($result, $attributes['detail']);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500, $th->getMessage());
        }
        $result->update($attributes);

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
}
