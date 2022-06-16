<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\TrainingTeacher\Category\Models\TrainingModule;

class TeacherTrainingBoardDetail extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate_teacher.TeacherTrainingBoardDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModuleId', 'TeacherTrainingBoardId'
    ];

    public function teacherTrainingBoardDetailChildren()
    {
        return $this->hasMany(TeacherTrainingBoardDetailChildren::class, 'TeacherTrainingBoardDetailId');
    }

    public function teacherTraining()
    {
        return $this->belongsTo(TeacherTrainingBoard::class, 'TeacherTrainingBoardId');
    }

    public function trainingModule()
    {
        return $this->belongsTo(TrainingModule::class, 'TrainingModuleId');
    }
}
