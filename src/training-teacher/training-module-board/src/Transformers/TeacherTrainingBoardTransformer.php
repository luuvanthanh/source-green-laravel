<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoard;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingModuleBoard\Transformers;
 */
class TeacherTrainingBoardTransformer extends BaseTransformer
{
    protected $availableIncludes = ['teacherTrainingBoardDetail'];

    public function includeTeacherTrainingBoardDetail(TeacherTrainingBoard $teacherTrainingBoard)
    {
        return $this->collection($teacherTrainingBoard->teacherTrainingBoardDetail,new TeacherTrainingBoardDetailTransformer, 'TeacherTrainingBoardDetail');
    }
}
