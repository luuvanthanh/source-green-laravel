<?php

namespace GGPHP\SurveyForm\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class SurveyFormTransformer.
 *
 * @package namespace App\Transformers;
 */
class SurveyFormTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * Transform the SurveyForm entity.
     *
     * @param SurveyForm $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
