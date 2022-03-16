<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Models;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Core\Models\UuidModel;

class EvaluateTeacher extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.EvaluateTeachers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EvaluateStepId', 'EvaluateTypeId', 'TeacherEvaluate', 'TeacherAreEvaluate', 'RatingLevelId', 'File'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
