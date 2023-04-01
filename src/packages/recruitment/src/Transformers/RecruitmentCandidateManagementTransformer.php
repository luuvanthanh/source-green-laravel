<?php

namespace GGPHP\Recruitment\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Models\RecruitmentCandidateManagement;
use GGPHP\Recruitment\Models\RecruitmentLevel;

/**
 * Class LevelTransformer.
 *
 * @package namespace GGPHP\Recruitment\Transformers;
 */
class RecruitmentCandidateManagementTransformer extends BaseTransformer
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
    protected $availableIncludes = ['level', 'division', 'recruitmentManagement', 'questionCandidate'];

    /**
     * Transform the Classes entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Status' => array_search($model->Status, RecruitmentCandidateManagement::STATUS),
        ];
    }

    public function includeLevel(RecruitmentCandidateManagement $recruitmentCandidateManagement)
    {
        if (is_null($recruitmentCandidateManagement->level)) {
            return null;
        }

        return $this->item($recruitmentCandidateManagement->level, new RecruitmentLevelTransformer, 'level');
    }

    public function includeDivision(RecruitmentCandidateManagement $recruitmentCandidateManagement)
    {
        if (is_null($recruitmentCandidateManagement->division)) {
            return null;
        }

        return $this->item($recruitmentCandidateManagement->division, new DivisionTransformer, 'division');
    }

    public function includeRecruitmentManagement(RecruitmentCandidateManagement $recruitmentCandidateManagement)
    {
        if (is_null($recruitmentCandidateManagement->recruitmentManagement)) {
            return null;
        }

        return $this->item($recruitmentCandidateManagement->recruitmentManagement, new RecruitmentManagerTransformer, 'recruitmentManagement');
    }

    public function includeQuestionCandidate(RecruitmentCandidateManagement $recruitmentCandidateManagement)
    {
        return $this->collection($recruitmentCandidateManagement->questionCandidate, new RecruitmentQuestionCandidateTransformer, 'questionCandidate');
    }
}
