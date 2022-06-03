<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Models;

use GGPHP\Core\Models\UuidModel;

class TeacherTrainingBoard extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TeacherTrainingBoards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function teacherTrainingBoardDetail()
    {
        return $this->hasMany(TeacherTrainingBoardDetail::class, 'TeacherTrainingBoardId');
    }
}
