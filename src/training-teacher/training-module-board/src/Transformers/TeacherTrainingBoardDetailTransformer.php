<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoardDetail;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingModuleBoard\Transformers;
 */
class TeacherTrainingBoardDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['teacherTrainingBoardDetailChildren'];

    public function includeTeacherTrainingBoardDetailChildren(TeacherTrainingBoardDetail $teacherTrainingBoardDetail)
    {
        return $this->collection($teacherTrainingBoardDetail->teacherTrainingBoardDetailChildren,new TeacherTrainingBoardDetailChildrenTransformer, 'TeacherTrainingBoardDetailChildrenTransformer');
    }
}
