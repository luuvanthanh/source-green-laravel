<?php

namespace GGPHP\SurveyForm\Transformers;

use GGPHP\Category\Transformers\TouristDestinationTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\SurveyForm\Models\SurveyForm;

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
    protected $availableIncludes = ['touristDestination', 'surveyFormResult'];

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
        $numberQuestion = 0;

        foreach ($model->json['pages'] as $key => $page) {
            $numberQuestion += count($page['elements']);
        }

        return [
            'number_question' => $numberQuestion,
            'number_result' => $model->results->count()
        ];
    }

    /**
     * Include EventAdditionalInformation
     * @param SurveyForm $fault
     */
    public function includeTouristDestination(SurveyForm $surveyForm)
    {
        if (is_null($surveyForm->touristDestination)) {
            return;
        }

        return $this->item($surveyForm->touristDestination, new TouristDestinationTransformer, 'TouristDestination');
    }

    /**
     * Include SurveyFormResult
     * @param SurveyForm $SurveyForm
     */
    public function includeSurveyForm(SurveyForm $surveyForm)
    {
        return $this->collection($surveyForm->results, new SurveyFormResultTransformer, 'SurveyFormResult');
    }
}
