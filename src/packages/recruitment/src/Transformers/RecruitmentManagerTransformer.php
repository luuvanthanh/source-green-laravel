<?php

namespace GGPHP\Recruitment\Transformers;

use GGPHP\Category\Transformers\DivisionTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Models\RecruitmentLevel;
use GGPHP\Recruitment\Models\RecruitmentManager;

/**
 * Class LevelTransformer.
 *
 * @package namespace GGPHP\Recruitment\Transformers;
 */
class RecruitmentManagerTransformer extends BaseTransformer
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
    protected $availableIncludes = ['recruitmentConfiguration', 'level', 'division'];

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

    public function includeRecruitmentConfiguration(RecruitmentManager $recruitmentConfiguration)
    {
        if (is_null($recruitmentConfiguration->recruitmentConfiguration)) {
            return null;
        }

        return $this->item($recruitmentConfiguration->recruitmentConfiguration, new RecruitmentConfigurationTransformer, 'recruitmentConfiguration');
    }

    public function includeLevel(RecruitmentManager $recruitmentConfiguration)
    {
        if (is_null($recruitmentConfiguration->level)) {
            return null;
        }

        return $this->item($recruitmentConfiguration->level, new RecruitmentLevelTransformer, 'level');
    }

    public function includeDivision(RecruitmentManager $recruitmentConfiguration)
    {
        if (is_null($recruitmentConfiguration->division)) {
            return null;
        }

        return $this->item($recruitmentConfiguration->division, new DivisionTransformer, 'division');
    }
}
