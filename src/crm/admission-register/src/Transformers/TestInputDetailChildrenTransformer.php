<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\TestInputDetailChildren;
use GGPHP\Crm\ChildDevelop\Transformers\ChildEvaluateDetailChildrentTransformer;
use GGPHP\Crm\ChildDevelop\Transformers\ChildEvaluateDetailTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class TestInputDetailChildrenTransformer extends BaseTransformer
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
    protected $availableIncludes = ['childEvaluateDetailChildren', 'childEvaluateDetail'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeChildEvaluateDetailChildren(TestInputDetailChildren $testInputDetailChildren)
    {
        if (empty($testInputDetailChildren->childEvaluateDetailChildren)) {
            return;
        }

        return $this->item($testInputDetailChildren->childEvaluateDetailChildren, new ChildEvaluateDetailChildrentTransformer, 'childEvaluateDetailChildren');
    }

    public function includeChildEvaluateDetail(TestInputDetailChildren $testInputDetailChildren)
    {
        if (empty($testInputDetailChildren->childEvaluateDetail)) {
            return;
        }

        return $this->item($testInputDetailChildren->childEvaluateDetail, new ChildEvaluateDetailTransformer, 'childEvaluateDetail');
    }
}
