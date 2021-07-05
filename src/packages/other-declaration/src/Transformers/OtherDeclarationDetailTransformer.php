<?php

namespace GGPHP\OtherDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\OtherDeclaration\Models\OtherDeclarationDetail;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class OtherDeclarationDetailTransformer.
 *
 * @package namespace GGPHP\OtherDeclaration\Transformers;
 */
class OtherDeclarationDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['employee'];

    public function customAttributes($model): array
    {
        return [
            "Detail" => json_decode($model->Detail),
        ];
    }

    /**
     * Include User
     * @param  OtherDeclarationDetail $otherDeclarationDetail
     */
    public function includeEmployee(OtherDeclarationDetail $otherDeclarationDetail)
    {
        if (empty($otherDeclarationDetail->employee)) {
            return;
        }

        return $this->item($otherDeclarationDetail->employee, new UserTransformer, 'Employee');
    }
}
