<?php

namespace GGPHP\Crm\ChildDevelop\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ChildEvaluateTransformer extends BaseTransformer
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
    protected $availableIncludes = ['childEvaluateDetail', 'categorySkill'];

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

    public function includeChildEvaluateDetail(ChildEvaluate $childEvaluete)
    {
        return $this->collection($childEvaluete->childEvaluateDetail, new ChildEvaluateDetailTransformer, 'ChildEvaluateDetail');
    }

    public function includeCategorySkill(ChildEvaluate $childEvaluate)
    {
        if (empty($childEvaluate->categorySkill)) {
            return;
        }
        return $this->item($childEvaluate->categorySkill, new CategorySkillTransformer, 'CategorySkill');
    }
}
