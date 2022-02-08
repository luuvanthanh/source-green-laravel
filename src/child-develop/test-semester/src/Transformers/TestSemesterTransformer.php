<?php

namespace GGPHP\ChildDevelop\TestSemester\Transformers;

use GGPHP\ChildDevelop\TestSemester\Models\TestSemester;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;

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
    protected $availableIncludes = ['testSemesterDetail', 'student'];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
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

            $data['test_semester'] = [
                'total_untesting' => $untesting + $cancel,
                'total_testing' => $testing,
                'total_finish' => $finish,
            ];
        }

        if (request()->is_summary_approvel_status && request()->is_summary_approvel_status == 'true') {
            $items = $this->getCurrentScope()->getResource()->getData();
            $status = $items->groupBy('ApprovelStatus')->map->count()->toArray();
            ksort($status);
            $unsent = isset($status[0]) ? $status[0] : 0;
            $unqulified = isset($status[1]) ? $status[1] : 0;
            $approved = isset($status[2]) ? $status[2] : 0;

            $data['ApprovelStatus'] = [
                'total_unsent' => $unsent,
                'total_unqualified' => $unqulified,
                'total_approved' => $approved,
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
}
