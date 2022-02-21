<?php

namespace GGPHP\ChildDevelop\TestSemester\Repositories\Eloquent;

use GGPHP\ChildDevelop\TestSemester\Presenters\TestSemesterPresenter;
use GGPHP\ChildDevelop\TestSemester\Repositories\Contracts\TestSemesterRepository;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetailChildren;
use GGPHP\ChildDevelop\TestSemester\Services\StudentServices;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Symfony\Component\HttpKernel\Exception\HttpException;

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

        if (!empty($attributes['key'])) {
            $this->model = $this->model->whereHas('student', function ($q) use ($attributes) {
                $q->whereLike('FullName', $attributes['key']);
            });
        }

        if (!empty($attributes['limit'])) {
            $testSemester = $this->paginate($attributes['limit']);
        } else {
            $testSemester = $this->get();
        }

        return $testSemester;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {

            $testSemester = TestSemester::where('StudentId', $attributes['studentId'])->where('AssessmentPeriodId', $attributes['assessmentPeriodId'])->first();

            if (!empty($attributes['status'])) {
                $attributes['status'] = TestSemester::STATUS[$attributes['status']];
            }

            if (!is_null($testSemester) && $attributes['status'] != $testSemester['Status']) {
                switch ($attributes['status']) {
                    case 1:
                        StudentServices::updateSTudentStatus('DOING', $attributes['studentId']);
                        break;
                    case 2:
                        StudentServices::updateSTudentStatus('DID', $attributes['studentId']);
                        break;
                    case 3:
                        $testSemester->testSemesterDetail()->delete();
                        StudentServices::updateSTudentStatus('DONOT', $attributes['studentId']);
                        break;
                    default:
                        break;
                }
            }

            if (is_null($testSemester)) {
                $testSemester = TestSemester::create($attributes);
                StudentServices::updateSTudentStatus('DOING', $attributes['studentId']);
            } else {
                $testSemester->update($attributes);
            }

            if (!empty($attributes['detail']['isCheck'])) {

                TestSemesterDetail::where('CategorySkillId', $attributes['detail']['categorySkillId'])->delete();
                $attributes['detail']['testSemesterId'] = $testSemester->Id;
                $attributes['detail']['status'] = TestSemesterDetail::STATUS[$attributes['detail']['status']];
                $testSemesterDetail = TestSemesterDetail::create($attributes['detail']);

                foreach ($attributes['detail']['isCheck'] as $value) {
                    $value['testSemesterDetailId'] = $testSemesterDetail->Id;
                    TestSemesterDetailChildren::create($value);
                }
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
        $student = StudentServices::createStudentInfo($attributes['studentInfo']);

        if (!empty($attributes['testInput'])) {
            $attributes['testInput']['studentId'] = $student->student->id;
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

        return parent::parserResult($testInput);
    }

    public function update(array $attributes, $id)
    {
        $testSemester = TestSemester::find($id);
        
        if (!empty($attributes['approvalStatus'])) {
            $attributes['approvalStatus'] = TestSemester::APPROVAL_STATUS[$attributes['approvalStatus']];
        }

        $testSemester->update($attributes);

        return parent::find($id);
    }
}
