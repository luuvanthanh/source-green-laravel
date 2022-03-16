<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Models;

use GGPHP\Category\Models\TypeOfContract;
use GGPHP\Core\Models\UuidModel;

class EvaluateTeacherDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.EvaluateTeacherDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'SkillGroupDetailId', 'Content'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
