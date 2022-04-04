<?php

namespace GGPHP\ChildDevelop\TestSemester\Transformers;

use GGPHP\ChildDevelop\ChildEvaluate\Transformers\ChildEvaluateDetailChildrenTransformer;
use GGPHP\ChildDevelop\ChildEvaluate\Transformers\ChildEvaluateDetailTransformer;
use GGPHP\ChildDevelop\ChildEvaluate\Transformers\ChildEvaluateTransformer;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetailChildren;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestSemesterDetailChildrenTransformer extends BaseTransformer
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
    protected $availableIncludes = ['childEvaluateDetail', 'childEvaluateDetailChildren', 'testSemesterDetail', 'childEvaluate'];

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

    public function includeChildEvaluateDetail(TestSemesterDetailChildren $testSemesterDetailChildren)
    {
        if (empty($testSemesterDetailChildren->childEvaluateDetail)) {
            return;
        }

        return $this->item($testSemesterDetailChildren->childEvaluateDetail, new ChildEvaluateDetailTransformer, 'ChildEvaluateDetail');
    }

    public function includeChildEvaluateDetailChildren(TestSemesterDetailChildren $testSemesterDetailChildren)
    {
        if (empty($testSemesterDetailChildren->childEvaluateDetailChildren)) {
            return;
        }

        return $this->item($testSemesterDetailChildren->childEvaluateDetailChildren, new ChildEvaluateDetailChildrenTransformer, 'ChildEvaluateDetailChildren');
    }

    public function includeTestSemesterDetail(TestSemesterDetailChildren $testSemesterDetailChildren)
    {
        if (empty($testSemesterDetailChildren->testSemesterDetail)) {
            return;
        }

        return $this->item($testSemesterDetailChildren->testSemesterDetail, new TestSemesterDetailTransformer, 'TestSemesterDetail');
    }

    public function includeChildEvaluate(TestSemesterDetailChildren $testSemesterDetailChildren)
    {
        if (empty($testSemesterDetailChildren->childEvaluate)) {
            return;
        }

        return $this->item($testSemesterDetailChildren->childEvaluate, new ChildEvaluateTransformer, 'childEvaluate');
    }
}
