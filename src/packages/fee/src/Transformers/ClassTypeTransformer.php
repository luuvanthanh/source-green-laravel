<?php

namespace GGPHP\Fee\Transformers;

use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Models\ClassType;

/**
 * Class ClassTypeTransformer.
 *
 * @package namespace GGPHP\Fee\Transformers;
 */
class ClassTypeTransformer extends BaseTransformer
{
    protected $availableIncludes = ['classes', 'chargeOldStudent'];

    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }

    public function includeClasses(ClassType $classType)
    {
        return $this->collection($classType->classes, new ClassesTransformer, 'Classes');
    }

    public function includeChargeOldStudent(ClassType $classType)
    {
        return $this->collection($classType->chargeOldStudent, new ChargeOldStudentTransformer, 'ChargeOldStudent');
    }
}
