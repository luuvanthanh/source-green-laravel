<?php

namespace GGPHP\TeacherAssignment\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TeacherAssignment\Models\TeacherAssignment;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TeacherAssignmentTransformer
 *
 * @package namespace GGPHP\TeacherAssignment\Transformers;
 */
class TeacherAssignmentTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['user', 'branch', 'classes'];

    protected $defaultIncludes = [];

    public function includeUser(TeacherAssignment $teacherAssignment)
    {
        if (is_null($teacherAssignment->user)) {
            return null;
        }

        return $this->item($teacherAssignment->user, new UserTransformer, 'User');
    }

    public function includeBranch(TeacherAssignment $teacherAssignment)
    {
        if (is_null($teacherAssignment->branch)) {
            return null;
        }

        return $this->item($teacherAssignment->branch, new BranchTransformer, 'Branch');
    }

    public function includeClasses(TeacherAssignment $teacherAssignment)
    {
        if (is_null($teacherAssignment->classes)) {
            return null;
        }

        return $this->item($teacherAssignment->classes, new ClassesTransformer, 'Classes');
    }
}
