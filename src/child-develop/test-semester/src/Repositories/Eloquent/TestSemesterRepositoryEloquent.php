<?php

namespace GGPHP\ChildDevelop\TestSemester\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\ChildDevelop\TestSemester\Presenters\TestSemesterPresenter;
use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetailChildren;
use GGPHP\ChildDevelop\TestSemester\Services\StudentServices;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Collection;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

use function Symfony\Component\Translation\t;

/**
 * Class InOutHistoriesRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class TestSemesterRepositoryEloquent extends BaseRepository implements TestSemesterRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'Id', 'CreationTime'
    ];


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
        return TestSemester::class;
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
        return TestSemesterPresenter::class;
    }

    public function getAll(array $attributes)
    {
        if (!empty($attributes['status'])) {
            $this->model = $this->model->whereIn('Status', $attributes['status']);
        }

        if (!empty($attributes['type'])) {
            $this->model = $this->model->whereIn('Type', $attributes['type']);
        }

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                $q->whereLike('FullName', $attributes['key']);
            });
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->where('EmployeeId', $attributes['employeeId']);
        }

        if (isset($attributes['age'])) {
            $this->model = $this->model->whereHas('testSemesterDetail.testSemesterDetailChildren.childEvaluate', function ($query) use ($attributes) {
                $query->where('Age', $attributes['age']);
            });
        }

        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('CreationTime', '>=', $attributes['startDate'])->whereDate('CreationTime', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['approvalStatus'])) {
            $this->model = $this->model->whereIn('ApprovalStatus', $attributes['approvalStatus']);
        }

        if (!empty($attributes['branchId'])) {
            $this->model = $this->model->whereHas('student.classes', function ($q) use ($attributes) {
                $q->where('BranchId', $attributes['branchId']);
            });
        }

        if (!empty($attributes['classId'])) {
            $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                $query->where('ClassId', $attributes['classId']);
            });
        }

        if (!empty($attributes['assessmentPeriodId'])) {
            $this->model = $this->model->where('AssessmentPeriodId', $attributes['assessmentPeriodId']);
        }

        if (!empty($attributes['schoolYearId'])) {
            $this->model = $this->model->whereHas('assessmentPeriod', function ($query) use ($attributes) {
                $query->where('SchoolYearId', $attributes['schoolYearId']);
            });
        }

        if (!empty($attributes['studentId'])) {
            $this->model = $this->model->where('StudentId', $attributes['studentId']);
        }

        if (!empty($attributes['limit'])) {
            $testSemester = $this->paginate($attributes['limit']);
        } else {
            $testSemester = $this->get();
        }

        if (empty($testSemester['data']) && !empty($attributes['classId'])) {
            $testSemester['countStudent'] = Student::where('ClassId', $attributes['classId'])->where('Status', Student::OFFICAL)->get()->count();
        }

        return $testSemester;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $testSemester = $this->model::where('StudentId', $attributes['studentId'])->where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->first();

            if ($attributes['status'] == TestSemester::STATUS['UNTESTING'] || $attributes['status'] == TestSemester::STATUS['TESTING'] || $attributes['status'] == TestSemester::STATUS['FINISH']) {
                if (is_null($testSemester)) {
                    $student = Student::find($attributes['studentId']);
                    $attributes['TimeAgeTestSemester'] = Carbon::parse($student->DayOfBirth)->diffInMonths(now());
                    $testSemester = $this->model::create($attributes);
                } else {
                    $testSemester->update($attributes);
                }

                if (!empty($attributes['detail']['isCheck'])) {
                    $this->storeTestSemesterDetail($attributes, $testSemester);
                }
            } else {
                $testSemester->testSemesterDetail()->delete();
                $testSemester->update([
                    'status' => TestSemester::STATUS['CANCEL'],
                    'approvalStatus' => TestSemester::APPROVAL_STATUS['UNSENT']
                ]);
            }

            \DB::commit();
        } catch (\Throwable $th) {
            \DB::rollback();
            throw new HttpException(500, $th->getMessage());
        }

        return parent::find($testSemester->Id);
    }

    public function officialStudent(array $attributes)
    {
        if (!empty($attributes['testInput'])) {
            $attributes['testInput']['type'] = TestSemester::TYPE['TEST_INPUT'];
            $attributes['testInput']['status'] = TestSemester::STATUS['FINISH'];
            $attributes['testInput']['approvalStatus'] = TestSemester::APPROVAL_STATUS['APPROVAD'];
            $testInput = TestSemester::create($attributes['testInput']);

            if (!empty($attributes['testInput']['detail'])) {
                foreach ($attributes['testInput']['detail'] as $value) {
                    $value['testSemesterId'] = $testInput->Id;
                    $value['status'] = TestSemesterDetail::STATUS['FINISH'];
                    $valueDetail = TestSemesterDetail::create($value);

                    if ($value['isCheck']) {
                        foreach ($value['isCheck'] as $valueIsCheck) {
                            $valueIsCheck['TestSemesterDetailId'] = $valueDetail->Id;
                            TestSemesterDetailChildren::create($valueIsCheck);
                        }
                    }
                }
            }
        }

        return parent::find($testInput->Id);
    }

    public function update(array $attributes, $id)
    {
        $testSemester = $this->model::find($id);

        if (!empty($attributes['approvalStatus']) && $attributes['approvalStatus'] === TestSemester::APPROVAL_STATUS['PENDING_APPROVED']) {
            $attributes['timePendingApproved'] = now()->format('Y-m-d H:i:s');
        }

        if (!empty($attributes['approvalStatus']) && $attributes['approvalStatus'] === TestSemester::APPROVAL_STATUS['APPROVED']) {
            $attributes['timeApproved'] = now()->format('Y-m-d H:i:s');
        }

        $testSemester->update($attributes);

        return parent::find($id);
    }

    public function testSemesterStudent(array $attributes)
    {
        if (!empty($attributes['assessmentPeriodId']) && !empty($attributes['status']) && !empty($attributes['whereDoesntHave']) == 'true') {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereDoesntHave('testSemester', function ($query) use ($attributes) {

                if (!empty($attributes['assessmentPeriodId'])) {
                    $query->where('AssessmentPeriodId', $attributes['assessmentPeriodId']);
                }

                if (!empty($attributes['status'])) {
                    $query->whereIn('Status', $attributes['status']);
                }

                $query->orderBy('CreationTime', 'DESC');
            });
        }

        if (!empty($attributes['assessmentPeriodId']) && !empty($attributes['status']) && !empty($attributes['whereHas']) == 'true') {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('testSemester', function ($query) use ($attributes) {

                if (!empty($attributes['assessmentPeriodId'])) {
                    $query->where('AssessmentPeriodId', $attributes['assessmentPeriodId']);
                }

                if (!empty($attributes['status'])) {
                    $query->whereIn('Status', $attributes['status']);
                }

                $query->orderBy('CreationTime', 'DESC');
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

        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Status', Student::OFFICAL);

        if (!empty($attributes['limit'])) {
            $student = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $student = $this->studentRepositoryEloquent->get();
        }

        return $student;
    }

    public function reportTestSemester($attributes)
    {
        $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('testSemester', function ($query) use ($attributes) {

            if (!empty($attributes['assessmentPeriodId'])) {
                $query->where('AssessmentPeriodId', $attributes['assessmentPeriodId']);
            }

            if (!empty($attributes['status'])) {
                $query->whereIn('Status', $attributes['status']);
            }

            if (!empty($attributes['schoolYearId'])) {
                $query->whereHas('assessmentPeriod', function ($q) use ($attributes) {
                    $q->where('SchoolYearId', $attributes['schoolYearId']);
                });
            }
        });

        if (!empty($attributes['branchId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classes', function ($query) use ($attributes) {
                $query->where('BranchId', $attributes['branchId']);
            });
        }

        if (!empty($attributes['classId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereHas('classStudent', function ($query) use ($attributes) {
                $arrayClass = explode(',', $attributes['classId']);
                $query->whereIn('ClassId', $arrayClass);
            });
        }

        if (!empty($attributes['studentId'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->where('Id', $attributes['studentId']);
        }

        if (!empty($attributes['key'])) {
            $this->studentRepositoryEloquent->model = $this->studentRepositoryEloquent->model->whereLike('FullName', $attributes['key']);
        }

        if (!empty($attributes['limit'])) {
            $student = $this->studentRepositoryEloquent->paginate($attributes['limit']);
        } else {
            $student = $this->studentRepositoryEloquent->get();
        }

        return $student;
    }

    public function storeTestSemesterDetail($attributes, $testSemester)
    {
        $testSemester->testSemesterDetail()->where('CategorySkillId', $attributes['detail']['categorySkillId'])->delete();
        $attributes['detail']['testSemesterId'] = $testSemester->Id;
        $attributes['detail']['serialNumber'] = TestSemesterDetail::max('SerialNumber') + 1;
        $testSemesterDetail = TestSemesterDetail::create($attributes['detail']);
        $totalScore = 0;

        foreach ($attributes['detail']['isCheck'] as $value) {
            $value['status'] = TestSemesterDetailChildren::STATUS[$value['status']];
            $value['testSemesterDetailId'] = $testSemesterDetail->Id;

            if ($value['status'] === TestSemesterDetailChildren::STATUS['CHECKED']) {
                $totalScore += $value['score'];
            }

            TestSemesterDetailChildren::create($value);
        }

        $testSemesterDetail->update(['TotalScore' => $totalScore]);
    }

    public function approvedTestSemester(array $attributes)
    {
        if (!empty($attributes['id'])) {
            $testSemesters = $this->model()::WhereIn('Id', explode(',', $attributes['id']))->get();
        } else {
            $this->model = $this->model->where('ApprovalStatus', TestSemester::APPROVAL_STATUS['PENDING_APPROVED']);

            if (!empty($attributes['branchId'])) {
                $this->model = $this->model->whereHas('student.classes', function ($q) use ($attributes) {
                    $q->where('BranchId', $attributes['branchId']);
                });
            }

            if (!empty($attributes['classId'])) {
                $this->model = $this->model->whereHas('student', function ($query) use ($attributes) {
                    $query->where('ClassId', $attributes['classId']);
                });
            }

            if (!empty($attributes['assessmentPeriodId'])) {
                $this->model = $this->model->where('AssessmentPeriodId', $attributes['assessmentPeriodId']);
            }

            if (!empty($attributes['schoolYearId'])) {
                $this->model = $this->model->where('SchoolYearId', $attributes['schoolYearId']);
            }

            if (!empty($attributes['key'])) {
                $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                    $q->whereLike('FullName', $attributes['key']);
                });
            }

            $testSemesters = $this->model->orderBy('CreationTime')->get();
        }

        if (count($testSemesters) > 0) {

            foreach ($testSemesters as $testSemester) {
                $testSemester->update([
                    'timeApproved' => now()->format('Y-m-d H:i:s'),
                    'approvalStatus' => TestSemester::APPROVAL_STATUS[$attributes['approvalStatus']]
                ]);

                $student = $testSemester->student;
                $studentAccount = $testSemester->student->parent()->with('account')->get();

                $images =  json_decode($student->FileImage);
                $urlImage = '';

                if (!empty($images)) {
                    $urlImage = env('IMAGE_URL') . $images[0];
                }
                $message = 'Đánh giá định kỳ' . ' ' . $student->FullName;

                if (!empty($studentAccount)) {
                    $dataNoti = [
                        'users' => array_column($studentAccount->pluck('account')->toArray(), 'AppUserId'),
                        'title' => $student->FullName,
                        'imageURL' => $urlImage,
                        'message' => $message,
                        'moduleType' => 22,
                        'refId' => $testSemester->Id,
                    ];
                    dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNoti));
                }
            }
        }

        return parent::all();
    }
}
