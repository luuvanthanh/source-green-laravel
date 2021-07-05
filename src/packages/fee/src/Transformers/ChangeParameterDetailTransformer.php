<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ChangeParameterDetail;

/**
 * Class ChangeParameterDetailTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ChangeParameterDetailTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [

        ];
    }
}
