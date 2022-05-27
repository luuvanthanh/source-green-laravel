<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Models;

use GGPHP\Core\Models\UuidModel;

class TeacherTrainingBoardDetailChildren extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TeacherTrainingBoardDetailChildrens';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModuleDetailId', 'Date', 'TeacherTrainingBoardDetailId'
    ];

    public function teacherTrainingBoardDetail()
    {
        return $this->belongsTo(TeacherTrainingBoardDetail::class, 'TeacherTrainingBoardDetailId');
    }
}
