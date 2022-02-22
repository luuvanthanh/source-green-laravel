<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\ClassStudent;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ClassStudentTransformer.
 *
 * @package namespace App\Transformers;
 */
class ClassStudentTransformer extends BaseTransformer
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
    protected $availableIncludes = ['class'];

    /**
     * Transform the Student entity.
     *
     * @param ClassStudent $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

    /**
     * Include RankPositionInformation
     * @param ClassStudent $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClass(ClassStudent $classTeacher)
    {
        if (empty($classTeacher->classes)) {
            return;
        }

        return $this->item($classTeacher->classes, new ClassesTransformer, 'Class');
    }
}
