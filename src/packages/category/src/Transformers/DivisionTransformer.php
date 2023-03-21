<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Division;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Recruitment\Transformers\RecruitmentConfigurationTransformer;

/**
 * Class DivisionTransformer.
 *
 * @package namespace GGPHP\Division\Transformers;
 */
class DivisionTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['positions', 'recruitmentConfiguration'];

    /**
     * Include department
     * @param  Division $Division
     */
    public function includePositions(Division $division)
    {
        return $this->collection($division->positions, new PositionTransformer, 'Position');
    }

    public function includeRecruitmentConfiguration(Division $division)
    {
        return $this->collection($division->recruitmentConfiguration, new RecruitmentConfigurationTransformer, 'recruitmentConfiguration');
    }
}
