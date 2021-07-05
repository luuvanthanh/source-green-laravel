<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\PotentialStudent;

/**
 * Class PotentialStudentTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class PotentialStudentTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
