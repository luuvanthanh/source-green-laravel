<?php

namespace GGPHP\Recruitment\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Models\RecruitmentLevel;

/**
 * Class LevelTransformer.
 *
 * @package namespace GGPHP\Recruitment\Transformers;
 */
class RecruitmentLevelTransformer extends BaseTransformer
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
    protected $availableIncludes = ['recruitmentConfiguration'];

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

    public function includeRecruitmentConfiguration(RecruitmentLevel $recruitmentLevel)
    {
        return $this->collection($recruitmentLevel->recruitmentConfiguration, new RecruitmentConfigurationTransformer, 'recruitmentConfiguration');
    }
}
