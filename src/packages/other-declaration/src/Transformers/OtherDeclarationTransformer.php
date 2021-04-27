<?php

namespace GGPHP\OtherDeclaration\Transformers;

use GGPHP\Absent\Transformers\AbsentTypeTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\OtherDeclaration\Models\OtherDeclaration;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class OtherDeclarationTransformer.
 *
 * @package namespace GGPHP\OtherDeclaration\Transformers;
 */
class OtherDeclarationTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'absentType'];
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
    public function includeEmployee(OtherDeclaration $otherDeclaration)
    {
        if (empty($otherDeclaration->employee)) {
            return;
        }

        return $this->item($otherDeclaration->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include User
     * @param  OtherDeclaration $otherDeclaration
     */
    public function includeOtherDeclarationDetail(OtherDeclaration $otherDeclaration)
    {
        return $this->collection($otherDeclaration->otherDeclarationDetail, new OtherDeclarationDetailTransformer, 'OtherDeclarationDetail');
    }

    /**
     * Include User
     * @param  OtherDeclaration $otherDeclaration
     */
    public function includeAbsentType(OtherDeclaration $otherDeclaration)
    {
        if (empty($otherDeclaration->absentType)) {
            return;
        }

        return $this->item($otherDeclaration->absentType, new AbsentTypeTransformer, 'AbsentType');
    }
}
