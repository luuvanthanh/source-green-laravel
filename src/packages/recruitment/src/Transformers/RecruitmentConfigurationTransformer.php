<?php

namespace GGPHP\Recruitment\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Models\RecruitmentConfiguration;

/**
 * Class LevelTransformer.
 *
 * @package namespace GGPHP\Recruitment\Transformers;
 */
class RecruitmentConfigurationTransformer extends BaseTransformer
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
    protected $availableIncludes = ['level', 'division', 'question'];

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

    public function includeLevel(RecruitmentConfiguration $recruitmentConfiguration)
    {
        if (is_null($recruitmentConfiguration->level)) {
            return null;
        }

        return $this->item($recruitmentConfiguration->level, new RecruitmentLevelTransformer, 'level');
    }

    public function includeDivision(RecruitmentConfiguration $recruitmentConfiguration)
    {
        if (is_null($recruitmentConfiguration->division)) {
            return null;
        }

        return $this->item($recruitmentConfiguration->division, new DivisionTransformer, 'division');
    }

    public function includeQuestion(RecruitmentConfiguration $recruitmentConfiguration)
    {
        return $this->collection($recruitmentConfiguration->question, new RecruitmentQuestionTransformer, 'Question');
    }
}
