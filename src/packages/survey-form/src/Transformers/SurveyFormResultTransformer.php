<?php

namespace GGPHP\SurveyForm\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class SurveyFormResultTransformer.
 *
 * @package namespace App\Transformers;
 */
class SurveyFormResultTransformer extends BaseTransformer
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
     * Transform the SurveyFormResult entity.
     *
     * @param SurveyFormResult $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
