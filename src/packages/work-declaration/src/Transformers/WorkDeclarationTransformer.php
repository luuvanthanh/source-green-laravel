<?php

namespace GGPHP\WorkDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\WorkDeclaration\Models\WorkDeclaration;

/**
 * Class WorkDeclarationTransformer.
 *
 * @package namespace App\Transformers;
 */
class WorkDeclarationTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'workDeclarationDetails'];

    /**
     * Include Store
     * @param WorkDeclaration $lateEarly
     * @return \League\Fractal\Resource\Collection
     */
    public function includeWorkDeclarationDetails(WorkDeclaration $workDeclaration)
    {
        return $this->collection($workDeclaration->workDeclarationDetails, new WorkDeclarationDetailTransformer, 'WorkDeclarationDetail');
    }

    /**
     * Include employee
     * @param WorkDeclaration $workDeclaration
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(WorkDeclaration $workDeclaration)
    {
        if (empty($workDeclaration->employee)) {
            return;
        }

        return $this->item($workDeclaration->employee, new UserTransformer, 'Employee');
    }

}
