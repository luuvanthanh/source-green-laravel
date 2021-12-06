<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Transformers;

use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluateDetail;
use GGPHP\Core\Transformers\BaseTransformer;

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
    protected $availableIncludes = ['childEvaluateDetail'];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $age = null;

        foreach (ChildEvaluate::MONTH as $key => $value) {
            if ($value == $model->Age) {
                $age = $key;
            }
        }
        return [
            'Age' => $age
        ];
    }

    public function includeChildEvaluateDetail(ChildEvaluate $childEvaluete)
    {
        return $this->collection($childEvaluete->childEvaluateDetail, new ChildEvaluateDetailTransformer, 'ChildEvaluateDetail');
    }
}
