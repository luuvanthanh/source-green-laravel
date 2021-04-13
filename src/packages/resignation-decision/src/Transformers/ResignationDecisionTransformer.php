<?php

namespace GGPHP\ResignationDecision\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ResignationDecision\Models\ResignationDecision;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ResignationDecisionTransformer.
 *
 * @package namespace GGPHP\ResignationDecision\Transformers;
 */
class ResignationDecisionTransformer extends BaseTransformer
{

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];

    protected $defaultIncludes = [];

    /**
     * Include employee
     * @param  ResignationDecision $resignationDecision
     */
    public function includeEmployee(ResignationDecision $resignationDecision)
    {
        if (empty($resignationDecision->employee)) {
            return;
        }

        return $this->item($resignationDecision->employee, new UserTransformer, 'Employee');
    }
}
