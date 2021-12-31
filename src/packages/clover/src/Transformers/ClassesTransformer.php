<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\ClassTypeTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ClassesTransformer.
 *
 * @package namespace App\Transformers;
 */
class ClassesTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['branch', 'classType'];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'teacher', 'student'
    ];

    /**
     * Transform the Classes entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include schedules
     * @param Classes $classes
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBranch(Classes $classes)
    {
        if (empty($classes->branch)) {
            return;
        }

        return $this->item($classes->branch, new BranchTransformer, 'Branch');
    }

    /**
     * Include schedules
     * @param Classes $classes
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClassType(Classes $classes)
    {
        if (empty($classes->classType)) {
            return;
        }

        return $this->item($classes->classType, new ClassTypeTransformer, 'ClassType');
    }

    /**
     * Include teacher
     * @param Classes $classes
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTeacher(Classes $classes)
    {
        return $this->collection($classes->teacher, new UserTransformer, 'Teacher');
    }

    /**
     * Include teacher
     * @param Classes $classes
     * @return \League\Fractal\Resource\Collection
     */
    public function includeStudent(Classes $classes)
    {
        return $this->collection($classes->student, new StudentTransformer, 'Student');
    }
}
