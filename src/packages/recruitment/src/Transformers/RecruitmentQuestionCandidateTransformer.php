<?php

namespace GGPHP\Recruitment\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Models\QuestionCandidate;
use GGPHP\Recruitment\Models\RecruitmentLevel;

/**
 * Class LevelTransformer.
 *
 * @package namespace GGPHP\Recruitment\Transformers;
 */
class RecruitmentQuestionCandidateTransformer extends BaseTransformer
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
    protected $availableIncludes = ['recruitmentQuestion'];

    /**
     * Transform the Classes entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeRecruitmentQuestion(QuestionCandidate $questionCandidate)
    {
        if (is_null($questionCandidate->recruitmentQuestion)) {
            return null;
        }

        return $this->item($questionCandidate->recruitmentQuestion, new RecruitmentQuestionTransformer, 'recruitmentQuestionTransformer');
    }
}
