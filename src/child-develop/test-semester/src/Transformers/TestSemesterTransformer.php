<?php

namespace GGPHP\ChildDevelop\TestSemester\Transformers;

use GGPHP\ChildDevelop\Category\Transformers\AssessmentPeriodTransformer;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ClassTypeTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestSemesterTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['testSemesterDetail', 'student', 'classType', 'assessmentPeriod', 'employee', 'testSemesterHeadmaster'];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;
        $approvalStatus = null;
        $type = null;

        foreach (TestSemester::STATUS as $key => $value) {
            if (!is_null($model->Status)) {
                if ($value == $model->Status) {
                    $status = $key;
                }
            }
        }

        foreach (TestSemester::APPROVAL_STATUS as $key => $value) {
            if (!is_null($model->ApprovalStatus)) {
                if ($value == $model->ApprovalStatus) {
                    $approvalStatus = $key;
                }
            }
        }

        foreach (TestSemester::TYPE as $key => $value) {
            if (!is_null($model->Type)) {
                if ($value == $model->Type) {
                    $type = $key;
                }
            }
        }

        return [
            'Status' => $status,
            'ApprovalStatus' => $approvalStatus,
            'Type' => $type
        ];
    }

    public function customMeta(): array
    {
        $data = [];

        if (request()->is_summary_test_semester && request()->is_summary_test_semester == 'true') {

            $items = $this->getCurrentScope()->getResource()->getData();
            $status = $items->groupBy('Status')->map->count()->toArray();
            ksort($status);
            $untesting = isset($status[0]) ? $status[0] : 0;
            $testing = isset($status[1]) ? $status[1] : 0;
            $finish = isset($status[2]) ? $status[2] : 0;
            $cancel = isset($status[3]) ? $status[3] : 0;

            if (!empty(request()->classId)) {
                $student = Student::where('ClassId', request()->classId)->where('Status', Student::OFFICAL)->get();
                $totalStudent = $student->count();
                $untesting = $totalStudent - ($testing + $finish + $cancel);
            }

            $data['test_semester'] = [
                'total_untesting' => $untesting + $cancel,
                'total_testing' => $testing,
                'total_finish' => $finish,
            ];
        }

        if (request()->is_summary_approval_status && request()->is_summary_approval_status == 'true') {
            $items = $this->getCurrentScope()->getResource()->getData();
            $approvedStatus = $items->groupBy('ApprovalStatus')->map->count()->toArray();
            ksort($approvedStatus);
            $unsent = isset($approvedStatus[0]) ? $approvedStatus[0] : 0;
            $unQualified = isset($approvedStatus[1]) ? $approvedStatus[1] : 0;
            $approved = isset($approvedStatus[2]) ? $approvedStatus[2] : 0;
            $pendingApproved = isset($approvedStatus[3]) ? $approvedStatus[3] : 0;

            $data['ApprovalStatus'] = [
                'total_unsent' => $unsent,
                'total_unqualified' => $unQualified,
                'total_approved' => $approved,
                'total_pending_approved' => $pendingApproved
            ];
        }

        return $data;
    }

    public function includeTestSemesterDetail(TestSemester $testSemester)
    {
        return $this->collection($testSemester->testSemesterDetail, new TestSemesterDetailTransformer, 'TestSemesterDetail');
    }

    public function includeStudent(TestSemester $testSemester)
    {
        if (empty($testSemester->student)) {
            return;
        }

        return $this->item($testSemester->student, new StudentTransformer, 'Student');
    }

    public function includeClassType(TestSemester $testSemester)
    {
        if (empty($testSemester->classType)) {
            return;
        }

        return $this->item($testSemester->classType, new ClassTypeTransformer, 'ClassType');
    }

    public function includeAssessmentPeriod(TestSemester $testSemester)
    {
        if (empty($testSemester->assessmentPeriod)) {
            return;
        }

        return $this->item($testSemester->assessmentPeriod, new AssessmentPeriodTransformer, 'AssessmentPeriod');
    }

    public function includeEmployee(TestSemester $testSemester)
    {
        if (empty($testSemester->user)) {
            return null;
        }

        return $this->item($testSemester->user, new UserTransformer, 'Employee');
    }

    public function includeTestSemesterHeadmaster(TestSemester $testSemester)
    {
        return $this->collection($testSemester->testSemesterHeadmaster, new UserTransformer, 'Headmaster');
    }
}
