<?php

namespace GGPHP\TrainingTeacher\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TrainingModuleDetail extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'evaluate-teacher.TrainingModuleDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'TrainingModulelId', 'TrainingSkillDetailId'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
