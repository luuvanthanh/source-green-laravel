<?php

namespace GGPHP\SurveyForm\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\SurveyForm\Models\SurveyFormResult;

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
    protected $availableIncludes = ['surveyForm'];

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

    /**
     * Include SurveyForm
     * @param SurveyFormResult $SurveyFormResult
     */
    public function includeSurveyForm(SurveyFormResult $surveyFormResult)
    {
        if (is_null($surveyFormResult->survey)) {
            return;
        }

        return $this->item($surveyFormResult->survey, new SurveyFormTransformer, 'SurveyForm');
    }
}
