<?php

namespace GGPHP\ChildDevelop\TestSemester\Transformers;

use GGPHP\ChildDevelop\Category\Transformers\CategorySkillTransformer;
use GGPHP\ChildDevelop\TestSemester\Models\TestSemesterDetail;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestSemesterDetailTransformer extends BaseTransformer
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
    protected $availableIncludes = ['testSemesterDetailChildren', 'categorySkill'];

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

    public function includeTestSemesterDetailChildren(TestSemesterDetail $testSemesterDetail)
    {
        return $this->collection($testSemesterDetail->testSemesterDetailChildren, new TestSemesterDetailChildrenTransformer, 'TestSemesterDetailChildren');
    }

    public function includeCategorySkill(TestSemesterDetail $testSemesterDetail)
    {
        if (empty($testSemesterDetail->categorySkill)) {
            return;
        }

        return $this->item($testSemesterDetail->categorySkill, new CategorySkillTransformer, 'CategorySkill');
    }
}
