<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\ClassTeacher;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

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
    protected $availableIncludes = ['class', 'teacher'];

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
    public function includeClass(ClassTeacher $classTeacher)
    {
        if (empty($classTeacher->classes)) {
            return;
        }

        return $this->item($classTeacher->classes, new ClassesTransformer, 'Class');
    }

    public function includeTeacher(ClassTeacher $classTeacher)
    {
        if (empty($classTeacher->teacher)) {
            return;
        }

        return $this->item($classTeacher->teacher, new UserTransformer, 'Teacher');
    }
}
