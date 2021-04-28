<?php

namespace GGPHP\OtherDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class OtherDeclarationDetailTransformer.
 *
 * @package namespace GGPHP\OtherDeclaration\Transformers;
 */
class OtherDeclarationDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee'];

    /**
     * Include User
     * @param  OtherDeclaration $otherDeclaration
     */
    public function includeEmployee(OtherDeclaration $otherDeclaration)
    {
        if (empty($otherDeclaration->employee)) {
            return;
        }

        return $this->item($otherDeclaration->employee, new UserTransformer, 'Employee');
    }
}
