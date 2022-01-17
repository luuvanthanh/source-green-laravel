<?php

namespace GGPHP\Crm\ChildDevelop\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluateDetail;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ChildEvaluateDetailTransformer extends BaseTransformer
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
    protected $availableIncludes = ['childEvaluateDetailChildrent'];

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

    public function includeChildEvaluateDetailChildrent(ChildEvaluateDetail $childEvalueteDetail)
    {
        return $this->collection($childEvalueteDetail->childEvaluateDetailChildrent, new ChildEvaluateDetailChildrentTransformer, 'ChildEvaluateDetailChildrent');
    }
}
