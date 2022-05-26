<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\Branch;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ChargeOldStudentTransformer;

/**
 * Class BranchTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class BranchTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    protected $availableIncludes = ['chargeOldStudent'];

    public function includeChargeOldStudent(Branch $model)
    {
        return $this->collection($model->chargeOldStudent, new ChargeOldStudentTransformer, 'ChargeOldStudent');
    }
}
