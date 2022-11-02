<?php

namespace GGPHP\ChildDevelop\TestSemester\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Category\Models\Position;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetailChildren;
use GGPHP\ChildDevelop\TestSemester\Presenters\TestSemesterPresenter;
use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetailChildren;
use GGPHP\ChildDevelop\TestSemester\Services\StudentServices;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Repositories\Eloquent\StudentRepositoryEloquent;
use GGPHP\Users\Models\User;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Collection;
use Illuminate\Container\Container as Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use GGPHP\ExcelExporter\Services\ExcelExporterServices;
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

    protected $excelExporterServices;

    public function __construct(
        StudentRepositoryEloquent $studentRepositoryEloquent,
        Application $app,
        ExcelExporterServices $excelExporterServices
    ) {
        parent::__construct($app);
        $this->studentRepositoryEloquent = $studentRepositoryEloquent;
        $this->excelExporterServices = $excelExporterServices;
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
        DB::beginTransaction();
        try {
            $testSemester = $this->model::where('StudentId', $attributes['studentId'])->where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->first();

            if ($attributes['status'] == TestSemester::STATUS['UNTESTING'] || $attributes['status'] == TestSemester::STATUS['TESTING'] || $attributes['status'] == TestSemester::STATUS['FINISH']) {
                if (is_null($testSemester)) {
                    $student = Student::find($attributes['studentId']);
                    $attributes['TimeAgeTestSemester'] = (int) Carbon::parse($student->DayOfBirth)->floatDiffInRealMonths(now());
                    $testSemester = $this->model::create($attributes);
                } else {
                    $testSemester->update($attributes);
                }

                if (!empty($attributes['detail']['isCheck'])) {
                    $this->storeTestSemesterDetail($attributes, $testSemester);
                }
            } else {
                if (!is_null($testSemester)) {
                    $testSemester->testSemesterDetail()->delete();
                    $testSemester->update([
                        'status' => TestSemester::STATUS['CANCEL'],
                        'approvalStatus' => TestSemester::APPROVAL_STATUS['UNSENT']
                    ]);
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
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

        $student = $testSemester->student;
        $branchId = $student->classes->BranchId;

        $employee = User::where('Status', User::STATUS['WORKING'])->whereHas('positionLevelNow', function ($q) use ($branchId) {
            $q->where('BranchId', $branchId)->whereHas('position', function ($query) {
                $query->where('Code', Position::HIEUTRUONG);
            });
        })->with('account')->get();

        if (!empty($attributes['approvalStatus']) && $attributes['approvalStatus'] === TestSemester::APPROVAL_STATUS['UNQUALIFIED']) {
            $attributes['approvalStatus'] = TestSemester::APPROVAL_STATUS['APPROVED'];
            $attributes['timeApproved'] = now()->format('Y-m-d H:i:s');
            $parentAccount = $testSemester->student->parent()->with('account')->get();

            $images =  json_decode($student->FileImage);
            $urlImage = '';

            if (!empty($images)) {
                $urlImage = env('IMAGE_URL') . $images[0];
            }
            $message = 'Đánh giá định kỳ' . ' ' . $student->FullName;

            $arrId = array_merge(array_column($employee->pluck('account')->toArray(), 'AppUserId'), array_column($parentAccount->pluck('account')->toArray(), 'AppUserId'));

            if (!empty($arrId)) {
                $dataNotiCation = [
                    'users' => $arrId,
                    'title' => $student->FullName,
                    'imageURL' => $urlImage,
                    'message' => $message,
                    'moduleType' => 22,
                    'refId' => $testSemester->Id,
                ];
                dispatch(new \GGPHP\Core\Jobs\SendNotiWithoutCode($dataNotiCation));
            }
        }

        $testSemester->update($attributes);
        $testSemester->testSemesterHeadmaster()->attach(array_column($employee->ToArray(), 'Id'));

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

            if (!empty($value['status'])) {
                $value['status'] = TestSemesterDetailChildren::STATUS[$value['status']];

                if ($value['status'] === TestSemesterDetailChildren::STATUS['CHECKED']) {
                    $totalScore += $value['score'];
                }
            }
            $value['testSemesterDetailId'] = $testSemesterDetail->Id;

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

                $nameOfTestSemester = $testSemester->assessmentPeriod->nameAssessmentPeriod->Name;
                $title = 'Đánh giá định kỳ' . ' ' . $nameOfTestSemester;
                $message = $student->FullName . ' ' . 'nhận đánh giá định kỳ' . ' ' . $nameOfTestSemester . ' ' . 'năm học' . ' ' . $testSemester->assessmentPeriod->schoolYear->YearFrom . '-' . $testSemester->assessmentPeriod->schoolYear->YearTo;

                if (!empty($studentAccount)) {
                    $dataNoti = [
                        'users' => array_column($studentAccount->pluck('account')->toArray(), 'AppUserId'),
                        'title' => $title,
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

    public function updateMultiple(array $attributes)
    {
        foreach ($attributes as $key => $value) {
            $testSemester = $this->model->find($value['id']);

            if (is_null($testSemester)) {
                continue;
            }

            $testSemester->update($value);
        }

        return parent::all();
    }

    public function updateScore(array $attributes, $id)
    {
        $testSemester = $this->model::find($id);
        $a = [];
        foreach ($testSemester->testSemesterDetail as $key => $valueDetail) {

            foreach ($valueDetail->testSemesterDetailChildren as $key2 => $value) {
                $childEvaluateDetailChildren = ChildEvaluateDetailChildren::find($value->ChildEvaluateDetailChildrenId);
                $childEvaluate = ChildEvaluate::find($value->ChildEvaluateId);

                $value->update([
                    'Score' => !empty($childEvaluateDetailChildren) ? $childEvaluateDetailChildren->Score : 0,
                    'Age' => $childEvaluate->Age
                ]);
            }

            $valueDetail->update(['TotalScore' => array_sum(array_column($valueDetail->testSemesterDetailChildren->ToArray(), 'Score'))]);
        }

        return parent::find($id);
    }

    public function updateDataTestSemester(array $attributes)
    {
        if (!empty($attributes['testSemesterId'])) {
            $testSemesters = $this->model()::where('Id', $attributes['testSemesterId'])->get();
        } else {
            $testSemesters = $this->model()::where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->get();
        }

        $arrNum = [
            0 => [0, 1, 2, 3, 4, 5, 6],
            1 => [7, 8, 9],
            2 => [10, 11, 12],
            3 => [13, 14, 15, 16, 17, 18],
            4 => [19, 20, 21, 22, 24],
            5 => [25, 26, 27, 28, 29, 30],
            6 => [31, 32, 33, 34, 35, 36],
            7 => [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
            8 => [51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
            9 => [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]
        ];

        foreach ($testSemesters as $key => $testSemester) {

            foreach ($arrNum as $key => $value) {
                if (in_array($testSemester->TimeAgeTestSemester, $value)) {
                    $getKey = $key;
                }
            }

            foreach ($testSemester->testSemesterDetail as $key2 => $testSemesterDetail) {
                $childEvaluateReal = ChildEvaluate::where('CategorySkillId', $testSemesterDetail->CategorySkillId)->where('Age', $getKey)->first();
                $childEvaluateDataSave = ChildEvaluate::whereIn('Id', array_column($testSemesterDetail->testSemesterDetailChildren->ToArray(), 'ChildEvaluateId'))->orderBy('Age', 'desc')->latest()->first();
                $arrAge = $childEvaluateDataSave->Age;
                $childEvaluate = ChildEvaluate::where('CategorySkillId', $testSemesterDetail->CategorySkillId)->where('Age', $arrAge)->first();

                if ($childEvaluateReal->Age != $arrAge) {
                    $rangeInt = range($childEvaluateReal->Age, $arrAge);
                    $lastInt = array_key_last(range($childEvaluateReal->Age, $arrAge));
                    unset($rangeInt[$lastInt]);
                    $childEvaluate = ChildEvaluate::where('CategorySkillId', $testSemesterDetail->CategorySkillId)->whereIn('Age', $rangeInt)->get();

                    foreach ($childEvaluate as $key => $valueChildEvaluate) {
                        foreach ($valueChildEvaluate->childEvaluateDetailHasOne->childEvaluateDetailChildren as $key => $valueChildren) {
                            $testSemesterDetailChildrenDataSaved = $testSemesterDetail->testSemesterDetailChildren()->where('ChildEvaluateDetailChildrenId', $valueChildren->Id)->first();

                            $collect = [
                                'ChildEvaluateId' => $valueChildEvaluate->Id,
                                'ChildEvaluateDetailId' => $valueChildEvaluate->childEvaluateDetailHasOne->Id,
                                'ChildEvaluateDetailChildrenId' => $valueChildren->Id,
                                'Score' => $valueChildren->Score,
                                'Status' => 1,
                                'Age' => $valueChildEvaluate->Age
                            ];
                            $testSemesterDetail->testSemesterDetailChildren()->create($collect);
                        }
                    }
                }

                $sumAge = array_sum(array_column($testSemesterDetail->testSemesterDetailChildren->where('Status', 1)->ToArray(), 'Score'));
                $testSemesterDetail->update(['TotalScore' => $sumAge]);
            }
        }

        return parent::all();
    }

    public function updateDataOldLastTestSemester(array $attributes)
    {
        if (!empty($attributes['testSemesterId'])) {
            $testSemesters = $this->model()::where('Id', $attributes['testSemesterId'])->get();
        } else {
            $testSemesters = $this->model()::where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->get();
        }

        foreach ($testSemesters as $key => $testSemester) {

            $children = TestSemesterDetailChildren::where('TestSemesterDetailId', $testSemester->testSemesterDetailForUpdate->Id)->whereHas('childEvaluate', function ($q) {
                $q->orderBy('Age', 'desc');
            })->with('childEvaluate')->first();

            $arrAge = $children->ToArray()['child_evaluate']['Age'];

            foreach ($testSemester->testSemesterDetail as $key => $valueDetail) {
                $childEvaluate = ChildEvaluate::where('CategorySkillId', $valueDetail->CategorySkillId)->where('Age', $arrAge)->first();

                foreach ($childEvaluate->childEvaluateDetailHasOne->childEvaluateDetailChildren as $key => $valueChildren) {
                    $testSemesterDetailChildren = $valueDetail->testSemesterDetailChildren()->where('ChildEvaluateDetailChildrenId', $valueChildren->Id)->first();

                    $collect = [
                        'ChildEvaluateId' => $childEvaluate->Id,
                        'ChildEvaluateDetailId' => $childEvaluate->childEvaluateDetailHasOne->Id,
                        'ChildEvaluateDetailChildrenId' => $valueChildren->Id,
                        'Score' => $valueChildren->Score,
                        'Status' => 2,
                        'Age' => $childEvaluate->Age
                    ];

                    $valueDetail->testSemesterDetailChildren()->create($collect);
                }
            }
        }

        return parent::All();
    }

    public function excelTestSemester(array $attributes)
    {
        $params = [];
        $arrStudentId = explode(',', $attributes['studentId']);

        $testSemesters = $this->model()::whereIn('StudentId', $arrStudentId)->where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->get();

        foreach ($testSemesters as $key => $testSemester) {
            foreach ($testSemester->testSemesterDetail as $key => $detail) {
                foreach ($detail->testSemesterDetailChildren as $key => $children) {

                    $params['[branch]'][] = $testSemester->student->classes->branch->Name;
                    $params['[class]'][] = $testSemester->student->classes->Name;
                    $params['[student]'][] = $testSemester->student->FullName;
                    $params['[time_age]'][] = $testSemester->TimeAgeTestSemester;
                    $params['[age_test]'][] = !empty($children->childEvaluate) ? $children->childEvaluate->Age : '';
                    $params['[skill]'][] = $detail->categorySkill->Name;
                    $params['[content]'][] = !empty($children->childEvaluateDetailChildren) ? $children->childEvaluateDetailChildren->Content : '';
                }
            }
        }

        return $this->excelExporterServices->export('test_semester', $params);
    }
}
