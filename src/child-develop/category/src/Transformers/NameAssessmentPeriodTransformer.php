<?php

namespace GGPHP\ChildDevelop\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class NameAssessmentPeriodTransformer extends BaseTransformer
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
    protected $availableIncludes = [];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param NameAssessmentPeriod 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
