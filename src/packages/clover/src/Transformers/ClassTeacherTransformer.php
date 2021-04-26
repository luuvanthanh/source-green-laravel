<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\ClassTeacher;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ClassTeacherTransformer.
 *
 * @package namespace App\Transformers;
 */
class ClassTeacherTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['classes'];

    /**
     * Transform the Student entity.
     *
     * @param ClassTeacher $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

    /**
     * Include RankPositionInformation
     * @param ClassTeacher $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClasses(ClassTeacher $classTeacher)
    {
        if (empty($classTeacher->classes)) {
            return;
        }

        return $this->item($classTeacher->classes, new ClassesTransformer, 'Classes');
    }
}
