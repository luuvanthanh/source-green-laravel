<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\SchoolYear;

/**
 * Class SchoolYearTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class SchoolYearTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['fixedParameter', 'changeParameter'];

    public function customAttributes($model): array
    {
        return [

        ];
    }

    /**
     * Include Owner
     * @param SchoolYear $schoolYear
     * @return \League\Fractal\Resource\Item
     */
    public function includeFixedParameter(SchoolYear $schoolYear)
    {
        return $this->collection($schoolYear->fixedParameter, new FixedParameterTransformer, 'FixedParameter');
    }

    /**
     * Include Owner
     * @param SchoolYear $schoolYear
     * @return \League\Fractal\Resource\Item
     */
    public function includeChangeParameter(SchoolYear $schoolYear)
    {
        return $this->collection($schoolYear->changeParameter, new ChangeParameterTransformer, 'ChangeParameter');
    }
}
