<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoard;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingModuleBoard\Transformers;
 */
class TeacherTrainingBoardTransformer extends BaseTransformer
{
    protected $availableIncludes = ['teacherTrainingBoardDetail', 'employee'];

    public function includeTeacherTrainingBoardDetail(TeacherTrainingBoard $teacherTrainingBoard)
    {
        return $this->collection($teacherTrainingBoard->teacherTrainingBoardDetail, new TeacherTrainingBoardDetailTransformer, 'TeacherTrainingBoardDetail');
    }

    public function includeEmployee(TeacherTrainingBoard $teacherTrainingBoard)
    {
        return $this->item($teacherTrainingBoard->employee, new UserTransformer, 'Employee');
    }
}
