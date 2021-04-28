<?php

namespace GGPHP\OtherDeclaration\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;

/**
 * Class OtherDeclarationTransformer.
 *
 * @package namespace GGPHP\OtherDeclaration\Transformers;
 */
class OtherDeclarationTransformer extends BaseTransformer
{

    protected $availableIncludes = [];
    protected $defaultIncludes = ['otherDeclarationDetail'];

    public function customAttributes($model): array
    {
        return [
        ];
    }

    /**
     * Include User
     * @param  OtherDeclaration $otherDeclaration
     */
    public function includeOtherDeclarationDetail(OtherDeclaration $otherDeclaration)
    {
        return $this->collection($otherDeclaration->otherDeclarationDetail, new OtherDeclarationDetailTransformer, 'OtherDeclarationDetail');
    }

}
