<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Transformers\TrainingModuleTransformer;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Models\TeacherTrainingBoardDetail;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\TrainingModuleBoard\Transformers;
 */
class TeacherTrainingBoardDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['teacherTrainingBoardDetailChildren', 'trainingModule'];

    public function includeTeacherTrainingBoardDetailChildren(TeacherTrainingBoardDetail $teacherTrainingBoardDetail)
    {
        return $this->collection($teacherTrainingBoardDetail->teacherTrainingBoardDetailChildren, new TeacherTrainingBoardDetailChildrenTransformer, 'TeacherTrainingBoardDetailChildrenTransformer');
    }

    public function includeTrainingModule(TeacherTrainingBoardDetail $teacherTrainingBoardDetail)
    {
        return $this->item($teacherTrainingBoardDetail->trainingModule, new TrainingModuleTransformer, 'TrainingModule');
    }
}
