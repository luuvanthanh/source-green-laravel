<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\TestInput;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetail;
use GGPHP\Crm\ChildDevelop\Transformers\CategorySkillTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestInputDetailTransformer extends BaseTransformer
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
    protected $availableIncludes = ['testInputDetailChildren', 'categorySkill'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;
        foreach (TestInputDetail::STATUS as $key => $value) {
            if ($model->status == $value) {
                $status = $key;
            }
        }

        return [
            'status' => $status
        ];
    }

    public function includeTestInputDetailChildren(TestInputDetail $testInputDetail)
    {
        return $this->collection($testInputDetail->testInputDetailChildren, new TestInputDetailChildrenTransformer, 'TestInputDetailChildren');
    }

    public function includeCategorySkill(TestInputDetail $testInputDetail)
    {
        if (empty($testInputDetail->categorySkill)) {
            return;
        }

        return $this->item($testInputDetail->categorySkill, new CategorySkillTransformer, 'CategorySkill');
    }
}
